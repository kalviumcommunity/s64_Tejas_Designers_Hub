const express = require('express');
const router = express.Router();
// const Seller = require('../models/Seller');

// Get seller dashboard details (including products)
router.get('/:id/dashboard', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).populate('products');
    if (!seller) return res.status(404).json({ error: 'Seller not found' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
