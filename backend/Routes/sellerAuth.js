const express = require('express');
const router = express.Router();
const Seller = require('../Models/Seller');
const jwt = require('jsonwebtoken');

// Seller Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, businessName } = req.body;

        // Check if seller already exists
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists with this email' });
        }

        // Create new seller
        const seller = new Seller({
            name,
            email,
            password,
            phone,
            businessName
        });

        await seller.save();

        // Generate JWT token
        const token = jwt.sign(
            { sellerId: seller._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Seller registered successfully',
            token,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                businessName: seller.businessName
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering seller', error: error.message });
    }
});

// Seller Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find seller by email
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await seller.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { sellerId: seller._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                businessName: seller.businessName
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router; 