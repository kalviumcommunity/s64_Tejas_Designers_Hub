const jwt = require('jsonwebtoken');
const Seller = require('../Models/Seller');

const authenticateSeller = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authentication failed: No bearer token');
      return res.status(401).json({ 
        message: 'Authentication required. Please login.' 
      });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];
    console.log('Token received:', token.substring(0, 10) + '...');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Token decoded:', JSON.stringify(decoded));

    // Find seller by ID from token (support both id and sellerId formats)
    const sellerId = decoded.id || decoded.sellerId;
    
    if (!sellerId) {
      console.log('Authentication failed: No seller ID in token');
      return res.status(401).json({ 
        message: 'Invalid token format - no seller ID found' 
      });
    }
    
    console.log('Looking up seller with ID:', sellerId);
    const seller = await Seller.findById(sellerId).select('-password');
    
    if (!seller) {
      console.log('Authentication failed: Seller not found with ID', sellerId);
      return res.status(401).json({ 
        message: 'Invalid authentication token - seller not found' 
      });
    }

    // Add seller object to request
    req.seller = seller;
    console.log('Authentication successful for seller:', seller.email);
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token format.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired. Please login again.' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Server authentication error.',
      details: error.message
    });
  }
};

module.exports = authenticateSeller;
