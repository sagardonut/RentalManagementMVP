const Room = require('../models/Room.model');

// GET /api/rooms  (with pagination + filters)
exports.getRooms = async (req, res) => {
  console.log("STEP 1: controller hit");
  try {
    const { agentId, location, type, minPrice, maxPrice, page = 1, limit = 6 } = req.query;
    let query = { status: 'approved' };
    if (agentId) query.agentId = agentId;
    if (location && location !== 'All Locations') query.location = new RegExp(location, 'i');
    if (type && type !== 'Room Type') query.type = new RegExp(type, 'i');
    if (minPrice || maxPrice) {
      query.pricePerMonth = {};
      if (minPrice) {
        const min = parseInt(minPrice);
        if (!isNaN(min)) query.pricePerMonth.$gte = min;
      }
      if (maxPrice) {
        const max = parseInt(maxPrice);
        if (!isNaN(max)) query.pricePerMonth.$lte = max;
      }
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
      .sort({ pricePerMonth: 1 });
    console.log("STEP 6: after Room.find");

    console.log("STEP 7: before response");
    res.status(200).json({ rooms, total, pages: Math.ceil(total / limitNum), currentPage: pageNum });
    console.log("STEP 8: response sent");
  } catch (error) {
    console.error("ERROR in getRooms:", error);
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

// GET /api/rooms/price-ranges (dynamic price buckets)
exports.getPriceRanges = async (req, res) => {
  try {
    const maxRoom = await Room.findOne().sort({ pricePerMonth: -1 });
    
    if (!maxRoom) {
      return res.status(200).json([]);
    }
    
    const maxPrice = maxRoom.pricePerMonth;
    const ranges = [];
    let currentMin = 0;
    const step = 5000;
    
    while (currentMin < maxPrice) {
      let currentMax = currentMin + step;
      if (currentMax > maxPrice) {
        currentMax = maxPrice;
      }
      ranges.push({
        value: `${currentMin}-${currentMax}`,
        label: `NPR ${currentMin} - ${currentMax}`
      });
      currentMin = currentMax;
      if (currentMin === maxPrice) break;
    }
    
    ranges.push({
      value: `${maxPrice}-`,
      label: `Above NPR ${maxPrice}`
    });
    
    res.status(200).json(ranges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price ranges', error: error.message });
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
      type: type || 'single',
      amenities: amenities || [],
      images: images || [],
      agentId: req.user._id,
      isVerified: false,
      isAvailable: true,
      status: 'pending',
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
};

// PUT /api/rooms/:id  (agent updates their room)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user data missing' });
    }
    if (room.agentId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to edit this room' });
    }
    const { title, description, pricePerMonth, location, type, amenities, images, isVerified, isAvailable } = req.body;
    room.title = title ?? room.title;
    room.description = description ?? room.description;
    room.pricePerMonth = pricePerMonth ?? room.pricePerMonth;
    room.location = location ?? room.location;
    room.type = type ?? room.type;
    room.amenities = amenities ?? room.amenities;
    room.images = images ?? room.images;
    room.isVerified = isVerified ?? room.isVerified;
    room.isAvailable = isAvailable ?? room.isAvailable;
    const updated = await room.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
};

// DELETE /api/rooms/:id  (agent deletes their room)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user data missing' });
    }
    if (room.agentId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin' && req.user.role !== 'agency') {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }
    await room.deleteOne();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

// GET /api/rooms/my-rooms (Agent fetches their own rooms)
exports.getMyRooms = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const query = { agentId: req.user._id };
    const total = await Room.countDocuments(query);
    const rooms = await Room.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
      
    res.status(200).json({ rooms, total, pages: Math.ceil(total / limitNum), currentPage: pageNum });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching my rooms', error: error.message });
  }
};

// GET /api/rooms/agency/pending (Agency fetches pending rooms)
exports.getPendingRooms = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'agency' && req.user.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Not authorized to view pending rooms' });
    }
    
    let query = { status: 'pending' };
    
    if (req.user.role === 'agency') {
      // Find all agents belonging to this agency
      const User = require('../models/User.model');
      const agents = await User.find({ agencyId: req.user._id }, '_id');
      const agentIds = agents.map(a => a._id);
      agentIds.push(req.user._id); // Include the agency itself
      
      query.agentId = { $in: agentIds };
    }
    
    const rooms = await Room.find(query).populate('agentId', 'fullName email avatar');
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending rooms', error: error.message });
  }
};

// GET /api/rooms/admin/all (Admin/Agency fetches all rooms)
exports.getAllAdminRooms = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'agency' && req.user.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Not authorized to view all admin rooms' });
    }
    
    let query = {};
    if (req.user.role === 'agency') {
      const User = require('../models/User.model');
      const agents = await User.find({ agencyId: req.user._id }, '_id');
      const agentIds = agents.map(a => a._id);
      agentIds.push(req.user._id); // Include the agency itself
      
      query.agentId = { $in: agentIds };
    }
    
    const rooms = await Room.find(query)
      .populate('agentId', 'fullName email avatar')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all admin rooms', error: error.message });
  }
};

// PATCH /api/rooms/:id/status (Agency/Admin approve or reject)
exports.updateRoomStatus = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'agency' && req.user.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Not authorized to update room status' });
    }
    
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    
    if (req.user.role === 'agency') {
      const User = require('../models/User.model');
      const agent = await User.findById(room.agentId);
      if (!agent || agent.agencyId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to approve this room' });
      }
    }
    
    room.status = status;
    if (status === 'approved') {
      room.isVerified = true;
    } else {
      room.isVerified = false;
    }
    
    const updated = await room.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating room status', error: error.message });
  }
};