const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Models/User'); // Adjust the path as needed
const router = express.Router();
const jwt = require('jsonwebtoken');
const Seller = require('../Models/Seller');
const { registerSeller, loginSeller } = require('../controllers/AuthController');

router.post('/register', registerSeller);
router.post('/login', loginSeller);

// ✅ Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Respond with user data (excluding password)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Seller registration route
router.post('/seller/signup', async (req, res) => {
  const { shopName, ownerName, email, phone, password, confirmPassword } = req.body;

  try {
    // Validate input
    if (!shopName || !ownerName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new seller
    const newSeller = new Seller({
      shopName,
      ownerName,
      email,
      phone,
      password // Password will be hashed by the pre-save middleware
    });

    // Save seller to database
    await newSeller.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newSeller._id, email: newSeller.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    // Send success response
    res.status(201).json({
      message: "Seller registered successfully",
      token,
      seller: {
        id: newSeller._id,
        shopName: newSeller.shopName,
        ownerName: newSeller.ownerName,
        email: newSeller.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering seller", error: error.message });
  }
});

// Seller login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find seller by email
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    // Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      seller: {
        id: seller._id,
        shopName: seller.shopName,
        ownerName: seller.ownerName,
        email: seller.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

module.exports = router;
