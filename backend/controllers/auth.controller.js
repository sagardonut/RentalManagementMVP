const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      role: role || 'user',
      hasPaidFee: true, // Auto-set true for this simulation as requested
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        hasPaidFee: user.hasPaidFee,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    console.log(`[LOGIN ATTEMPT] Email: ${email}, DB Role: ${user?.role}, Expected Role: ${expectedRole}`);

    let isMatch = false;
    if (user) {
      isMatch = await user.comparePassword(password);
      
      // Auto-heal logic: If bcrypt fails, check if the password was stored as plain text
      if (!isMatch && user.password === password) {
        console.log(`[AUTO-HEAL] Corrupted plaintext password detected for ${email}. Re-hashing...`);
        user.password = password; // Triggers pre('save') hook
        await user.save();
        isMatch = true;
      }
    }

    if (user && isMatch) {
      // Role validation: Enforce strict role matching, unless the user is a superadmin
      if (!expectedRole) {
        return res.status(400).json({ message: 'System Update: Please refresh your browser to log in.' });
      }
      
      if (user.role !== expectedRole) {
        console.log(`[LOGIN FAILED] Role mismatch. Expected: ${expectedRole}, Actual: ${user.role}`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        hasPaidFee: user.hasPaidFee,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        hasPaidFee: user.hasPaidFee,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/auth/payment-status
// @access  Private
exports.updatePaymentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.hasPaidFee = true;
    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      hasPaidFee: user.hasPaidFee,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};