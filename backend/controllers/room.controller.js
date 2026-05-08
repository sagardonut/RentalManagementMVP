const Room = require('../models/Room.model');

// GET /api/rooms  (with pagination + filters)
exports.getRooms = async (req, res) => {
  console.log("STEP 1: controller hit");
  try {
    const { agentId, agencyId, location, type, maxPrice, page = 1, limit = 6 } = req.query;
    let query = {};
    if (agentId) {
      query.agentId = agentId;
    } else if (agencyId) {
      // Find all agents belonging to this agency
      const User = require('../models/User.model');
      const agents = await User.find({ agencyId }).select('_id');
      const agentIds = agents.map(a => a._id);
      // Include rooms managed by the agency itself and its agents
      query.agentId = { $in: [agencyId, ...agentIds] };
    }
    if (location && location !== 'All Locations') query.location = new RegExp(location, 'i');
    if (type && type !== 'Room Type') query.type = new RegExp(type, 'i');
    if (maxPrice) {
      const price = parseInt(maxPrice.replace(/[^0-9]/g, ''));
      if (!isNaN(price)) query.pricePerMonth = { $lte: price };
    }
    console.log("STEP 2: query parsed");

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    console.log("STEP 3: before countDocuments");
    const total = await Room.countDocuments(query);
    console.log("STEP 4: after countDocuments");

    console.log("STEP 5: before Room.find");
    const rooms = await Room.find(query)
      .populate('agentId', 'fullName avatar email')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    console.log("STEP 6: after Room.find");

    console.log("STEP 7: before response");
    res.status(200).json({ rooms, total, pages: Math.ceil(total / limitNum), currentPage: pageNum });
    console.log("STEP 8: response sent");
  } catch (error) {
    console.error("ERROR in getRooms:", error);
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

// GET /api/rooms/:id  (single room by MongoDB _id)
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('agentId', 'fullName avatar email phone');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (error) {
    // Handle invalid ObjectId format gracefully
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

// POST /api/rooms  (agent creates a room)
exports.createRoom = async (req, res) => {
  try {
    const { title, description, pricePerMonth, location, type, amenities, images } = req.body;
    if (!title || !description || !pricePerMonth || !location) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user data missing' });
    }
    const room = await Room.create({
      title, description, pricePerMonth, location,
      type: type || '1 BHK',
      amenities: amenities || [],
      images: images || [],
      agentId: req.user._id,
      isVerified: false,
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
};

// PUT /api/rooms/:id  (agent updates their room)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('agentId');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user data missing' });
    }
    
    const isOwner = room.agentId._id.toString() === req.user._id.toString();
    const isAgencyAdmin = room.agentId.agencyId && room.agentId.agencyId.toString() === req.user._id.toString();
    
    if (!isOwner && !isAgencyAdmin) {
      return res.status(403).json({ message: 'Not authorized to edit this room' });
    }
    const { title, description, pricePerMonth, location, type, amenities, images, isVerified } = req.body;
    room.title = title ?? room.title;
    room.description = description ?? room.description;
    room.pricePerMonth = pricePerMonth ?? room.pricePerMonth;
    room.location = location ?? room.location;
    room.type = type ?? room.type;
    room.amenities = amenities ?? room.amenities;
    room.images = images ?? room.images;
    room.isVerified = isVerified ?? room.isVerified;
    const updated = await room.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
};

// DELETE /api/rooms/:id  (agent deletes their room)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('agentId');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user data missing' });
    }
    
    const isOwner = room.agentId._id.toString() === req.user._id.toString();
    const isAgencyAdmin = room.agentId.agencyId && room.agentId.agencyId.toString() === req.user._id.toString();
    
    if (!isOwner && !isAgencyAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }
    await room.deleteOne();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

exports.placeholder = (req, res) => {
  res.status(200).json({ message: 'Room controller placeholder' });
};