const Room = require('../models/Room.model');
const User = require('../models/User.model');

// GET /api/admin/rooms — get all rooms (admin view with full data)
exports.getAllRooms = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Room.countDocuments(query);

    const rooms = await Room.find(query)
      .populate('agentId', 'fullName email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({ rooms, total, pages: Math.ceil(total / limitNum), currentPage: pageNum });
  } catch (error) {
    console.error('Admin get rooms error:', error);
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

// GET /api/admin/rooms/:id — single room for admin
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('agentId', 'fullName email avatar phone');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

// POST /api/admin/rooms — admin creates any room
exports.createRoom = async (req, res) => {
  try {
    const { title, description, pricePerMonth, location, type, amenities, images, agentId } = req.body;

    if (!title || !description || !pricePerMonth || !location) {
      return res.status(400).json({ message: 'Please fill all required fields: title, description, pricePerMonth, location' });
    }

    // Validate price
    const price = parseFloat(pricePerMonth);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // If agentId is provided, verify it belongs to an agent
    let assignedAgentId = agentId;
    if (agentId) {
      const agent = await User.findOne({ _id: agentId, role: { $in: ['agent', 'agency'] } });
      if (!agent) {
        return res.status(400).json({ message: 'Invalid agent ID' });
      }
    }

    const room = await Room.create({
      title,
      description,
      pricePerMonth: price,
      location,
      type: type || '1 BHK',
      amenities: amenities || [],
      images: images || [],
      agentId: assignedAgentId || null,
      isVerified: false
    });

    const populatedRoom = await Room.findById(room._id).populate('agentId', 'fullName email avatar');
    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error('Admin create room error:', error);
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
};

// PUT /api/admin/rooms/:id — admin updates any room
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const { title, description, pricePerMonth, location, type, amenities, images, isVerified, agentId } = req.body;

    // Validate price if provided
    if (pricePerMonth !== undefined) {
      const price = parseFloat(pricePerMonth);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }
      room.pricePerMonth = price;
    }

    // Validate agentId if provided
    if (agentId !== undefined) {
      if (agentId) {
        const agent = await User.findOne({ _id: agentId, role: { $in: ['agent', 'agency'] } });
        if (!agent) {
          return res.status(400).json({ message: 'Invalid agent ID' });
        }
      }
      room.agentId = agentId || null;
    }

    if (title !== undefined) room.title = title;
    if (description !== undefined) room.description = description;
    if (location !== undefined) room.location = location;
    if (type !== undefined) room.type = type;
    if (amenities !== undefined) room.amenities = amenities;
    if (images !== undefined) room.images = images;
    if (isVerified !== undefined) room.isVerified = isVerified;

    const updated = await room.save();
    const populatedRoom = await Room.findById(updated._id).populate('agentId', 'fullName email avatar');
    res.status(200).json(populatedRoom);
  } catch (error) {
    console.error('Admin update room error:', error);
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
};

// DELETE /api/admin/rooms/:id — admin deletes any room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    await room.deleteOne();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Admin delete room error:', error);
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

// PUT /api/admin/rooms/:id/verify — admin verifies/unverifies a room
exports.verifyRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const { isVerified } = req.body;
    room.isVerified = isVerified !== undefined ? isVerified : !room.isVerified;
    const updated = await room.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Admin verify room error:', error);
    res.status(500).json({ message: 'Error verifying room', error: error.message });
  }
};
