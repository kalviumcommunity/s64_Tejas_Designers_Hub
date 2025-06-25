const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser"); // If using cookies
const authenticateSeller = require('./middleware/authMiddleware');
const Database = require('./config/db');
const jwt = require('jsonwebtoken');

// Routes
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const sellerAuthRoutes = require("./Routes/sellerAuth");
const authRoutes = require("./Routes/authRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
Database();

// Ensure 'uploads' folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Middleware
app.use(cors({
  origin: ['https://localhost:5173', 'https://designerhubbb.netlify.app', 'https://designerh.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(cookieParser()); // If using cookies
app.use('/uploads', express.static(uploadPath));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to DesignerHub API");
});

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/seller-auth", sellerAuthRoutes);

// Add a debug route after your existing routes and before the error handler
app.get('/api/debug/verify-token', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided in Authorization header' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Just display token info without verification
    const decoded = jwt.decode(token);
    
    res.json({
      success: true,
      message: 'Token decoded (not verified)',
      tokenInfo: decoded,
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'unknown'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error decoding token',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
