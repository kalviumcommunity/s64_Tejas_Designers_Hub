const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const authenticateUser = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('User authentication failed: No bearer token');
      return res.status(401).json({ 
        message: 'Authentication required. Please login.' 
      });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];
    console.log('User token received:', token.substring(0, 10) + '...');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('User token decoded:', JSON.stringify(decoded));

    // Find user by ID from token
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      console.log('User authentication failed: No user ID in token');
      return res.status(401).json({ 
        message: 'Invalid token format - no user ID found' 
      });
    }
    
    console.log('Looking up user with ID:', userId);
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      console.log('User authentication failed: User not found with ID', userId);
      return res.status(401).json({ 
        message: 'Invalid authentication token - user not found' 
      });
    }

    // Add user object to request
    req.user = user;
    console.log('Authentication successful for user:', user.email);
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('User auth middleware error:', error);
    
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

module.exports = authenticateUser; 