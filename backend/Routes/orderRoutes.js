const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middleware/userAuthMiddleware');

// *** IMPORTANT: Order matters for Express routes, more specific first ***

// Test route to verify API is working
router.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: "Orders API is working", timestamp: new Date().toISOString() });
});

// GET /api/orders/user - Get all orders for the authenticated user
// This route needs to be BEFORE any routes with :id params
router.get('/user', async (req, res) => {
  console.log('User orders route accessed');
  try {
    // Check for auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header');
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token received, attempting verification');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      
      if (!decoded.userId && !decoded.id) {
        console.log('No user ID in token');
        return res.status(401).json({ message: "Invalid token format" });
      }
      
      const userId = decoded.userId || decoded.id;
      console.log(`Fetching orders for user: ${userId}`);
      
      // Get all orders for this user with populated product details
      const orders = await Order.find({ buyer: userId })
        .populate({
          path: 'products.product',
          select: 'name price images'
        })
        .sort({ createdAt: -1 }); // Most recent first
      
      console.log(`Found ${orders.length} orders for user ${userId}`);
      
      return res.status(200).json(orders);
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Server error. Could not fetch orders." });
  }
});

// GET /api/orders/seller/:sellerId/recent - Get recent orders for a seller's dashboard
// This needs to be BEFORE the /:id route to avoid path conflicts
router.get('/seller/:sellerId/recent', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const limit = parseInt(req.query.limit) || 5; // Default to 5 recent orders
    
    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }
    
    console.log(`Fetching recent orders for seller: ${sellerId}, limit: ${limit}`);
    console.log(`AUTH HEADER: ${JSON.stringify(req.headers.authorization)}`);
    
    // Find recent orders with products from this seller
    const orders = await Order.find()
      .populate({
        path: 'products.product',
        match: { seller: sellerId },
        populate: {
          path: 'seller',
          select: 'shopName email'
        }
      })
      .populate({
        path: 'buyer',
        select: 'name email'
      })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit);
    
    // Filter orders same as above
    const sellerOrders = orders.filter(order => 
      order.products.some(item => item.product && item.product.seller)
    );
    
    console.log(`Found ${sellerOrders.length} recent orders for seller ${sellerId}`);
    
    res.status(200).json(sellerOrders);
  } catch (error) {
    console.error("Error fetching recent seller orders:", error);
    res.status(500).json({ message: "Server error. Could not fetch recent orders." });
  }
});

// GET /api/orders/seller/:sellerId - Get orders for a specific seller
// Also needs to be before other routes with path parameters
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }
    
    console.log(`Fetching all orders for seller: ${sellerId}`);
    console.log(`AUTH HEADER: ${JSON.stringify(req.headers.authorization)}`);
    
    try {
      // Try first to check if the sellerId is valid
      console.log('Checking seller ID validity...');
      if (sellerId !== 'dummy-id' && !mongoose.Types.ObjectId.isValid(sellerId)) {
        console.error('Invalid seller ID format:', sellerId);
        return res.status(400).json({ message: "Invalid seller ID format" });
      }
      
      // Debug: Check for all orders in the database
      const allOrdersCount = await Order.countDocuments();
      console.log(`Total orders in database: ${allOrdersCount}`);
      
      // Find orders that contain products from this seller
      // This requires a more complex query that looks at products.product.seller
      console.log('Populating orders with product information...');
      const orders = await Order.find()
        .populate({
          path: 'products.product',
          match: { seller: sellerId }, // Filter for products by this seller
          populate: {
            path: 'seller',
            select: 'shopName email'
          }
        })
        .populate({
          path: 'buyer',
          select: 'name email'
        });
      
      console.log(`Found ${orders.length} orders before filtering`);
      
      // Filter out orders that don't have any products from this seller
      // (since the populate match only filters the products, not the orders)
      const sellerOrders = orders.filter(order => 
        order.products.some(item => item.product && item.product.seller)
      );
      
      console.log(`Found ${sellerOrders.length} orders for seller ${sellerId}`);
      if (sellerOrders.length === 0) {
        console.log('No orders found. Raw orders count:', orders.length);
      }
      
      res.status(200).json(sellerOrders);
    } catch (innerError) {
      console.error("Detailed error:", innerError);
      throw innerError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      message: "Server error. Could not fetch orders.",
      errorType: error.name,
      errorMessage: error.message
    });
  }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { buyer, products, status, totalAmount, paymentMethod, address } = req.body;

    console.log("Creating order with data:", JSON.stringify({
      buyer,
      productCount: products?.length,
      totalAmount,
      paymentMethod,
      address
    }));

    // Validate required fields
    if (!buyer) {
      return res.status(400).json({ message: "Buyer ID is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(buyer)) {
      return res.status(400).json({ message: "Invalid buyer ID format." });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required and cannot be empty." });
    }

    if (totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({ message: "Total amount is required." });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required." });
    }

    if (!address) {
      return res.status(400).json({ message: "Address object is required." });
    }

    // Check address fields
    const requiredAddressFields = ['line1', 'city', 'state', 'postalCode', 'country'];
    const missingAddressFields = requiredAddressFields.filter(field => !address[field]);
    
    if (missingAddressFields.length > 0) {
      return res.status(400).json({ 
        message: `Address is missing required fields: ${missingAddressFields.join(', ')}`,
        missingFields: missingAddressFields
      });
    }

    // Validate product items have required structure and valid IDs
    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      
      if (!item.product) {
        return res.status(400).json({ message: `Product ID is missing for item at index ${i}` });
      }
      
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: `Invalid product ID format for item at index ${i}` });
      }
      
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: `Quantity must be greater than 0 for item at index ${i}` });
      }
    }

    // Create and save order
    const newOrder = new Order({
      buyer,
      products,
      status: status || 'Pending', // Use default if not provided
      totalAmount,
      paymentMethod,
      address
    });

    const savedOrder = await newOrder.save();
    console.log("Order created successfully:", savedOrder._id);
    res.status(201).json({ message: "Order created successfully.", order: savedOrder });

  } catch (error) {
    console.error("Error creating order:", error);
    // Send more detailed error message
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        details: messages.join(', '),
        errors: error.errors
      });
    }
    res.status(500).json({ 
      message: "Server error. Could not create order.", 
      error: error.message
    });
  }
});

// GET /api/orders - Get all orders (optional)
router.get('/', async (req, res) => {
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
