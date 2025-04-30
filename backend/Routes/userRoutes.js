const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../Models/User'); // Adjust path as needed

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Explicitly select password since it's hidden with select: false
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Send dummy token or generate a real JWT token here
    res.status(200).json({
      message: 'Login successful',
      token: 'dummy-auth-token', // Replace with JWT later if needed
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
