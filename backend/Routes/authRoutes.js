const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Seller = require('../Models/Seller');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

// Get user profile route
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt with:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log('Found user:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password using the model's method
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging in',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        console.log('Registration attempt with:', req.body);
        const { firstName, lastName, email, password, gender } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !gender) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email' 
            });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            gender
        });

        await user.save();
        console.log('New user created:', user._id);

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// seller routes


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
  router.post('/seller/login', async (req, res) => {
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