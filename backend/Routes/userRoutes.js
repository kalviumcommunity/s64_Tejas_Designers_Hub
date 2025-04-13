const express = require('express');
const router = express.Router();
const User = require('../Models/user');

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Dummy validation
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
      }
  
      // Create and save user
      const newUser = new User({ name, email, password });
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  });
  

module.exports = router;
