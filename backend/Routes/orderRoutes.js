const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { buyer, products, status, totalAmount, paymentMethod, address } = req.body;

    // Validate required fields
    if (
      !buyer ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !totalAmount ||
      !paymentMethod ||
      !address ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.country
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Optional: Validate product items have required structure
    for (let item of products) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({ message: "Each product must include product ID and quantity." });
      }
    }

    // Create and save order
    const newOrder = new Order({
      buyer,
      products,
      status,
      totalAmount,
      paymentMethod,
      address
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully.", order: newOrder });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error. Could not create order." });
  }
});

// GET /api/orders - Get all orders (optional)
router.get('/:id', async (req, res) => {
  try {
    const orders = await Order.find().populate('buyer').populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error. Could not fetch orders." });
  }
});

router.put('/:id', async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json({ message: 'Error updating order', error: err.message });
    }
  });

module.exports = router;
