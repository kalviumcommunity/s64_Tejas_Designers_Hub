const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Database = require('./config/db')

const userRoutes = require("./Routes/userRoutes");
const sellerRoutes = require("./Routes/sellerRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");


dotenv.config();
Database();

const app = express();
const PORT = process.env.PORT || 8000;
// const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// mongoose
//   .connect(MONGO_URI, {
    
//     serverSelectionTimeoutMS: 10000, // prevent timeout issues
//   })
//   .then(() => console.log("✅ Connected to MongoDB",MONGO_URI ))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to DesignerHub API");
});

// // API Routes
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
