const express = require('express');
const router = express.Router();
const Seller = require('../Models/Seller');
const { registerSeller, loginSeller } = require('../controllers/AuthController');

router.post('/register', registerSeller);
router.post('/login', loginSeller);

// POST /api/sellers
router.post('/', async (req, res) => {
  try {
    const { name, brandName, email, password } = req.body;

    if (!name || !brandName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newSeller = new Seller({ name, brandName, email, password });
    await newSeller.save();
    res.status(201).json(newSeller);
  } catch (error) {
    res.status(500).json({ message: 'Error creating seller', error: error.message });
  }
});

// @desc    Get all sellers
// @route   GET /api/sellers
router.get('/', async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving sellers', error: err.message });
  }
});

// Parameterized routes last
router.get('/:id', async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving sellers', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
    try {
      const updatedSeller = await Seller.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body, // Apply updates from request body
        },
        { new: true, runValidators: true } // Return the updated document
      );
  
      if (!updatedSeller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      res.json(updatedSeller);
    } catch (err) {
      res.status(500).json({ message: 'Error updating seller', error: err.message });
    }
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "Lax",
  });

module.exports = router;

