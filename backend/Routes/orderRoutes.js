const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.userId }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
