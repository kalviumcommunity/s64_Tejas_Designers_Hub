import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  
  useEffect(() => {
    // If somehow someone got to this page without being logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Get order data from localStorage
    const orderData = localStorage.getItem('lastOrder');
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(orderData);
        setOrder(parsedOrder);
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Clear the order data from localStorage after 5 minutes for security
    const cleanup = setTimeout(() => {
      localStorage.removeItem('lastOrder');
    }, 300000); // 5 minutes
    
    return () => clearTimeout(cleanup);
  }, [user, navigate]);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleViewOrders = () => {
    navigate('/profile');
  };

  // Fallback order number if real order not available
  const fallbackOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-12"
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8"
        >
          <FiCheckCircle className="text-5xl text-green-500" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-medium mb-4"
        >
          Order Successful!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Thank you for your order. We've received your purchase request and are processing it now.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 p-6 rounded-lg mb-8"
        >
          <div className="flex justify-center mb-4">
            <FiPackage className="text-4xl text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">Order Number:</p>
          <p className="text-xl font-mono font-medium">
            {order?._id ? order._id.toUpperCase() : fallbackOrderNumber}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            A confirmation email has been sent to {user?.email}
          </p>
          {order && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-500 mb-2">Order Summary:</p>
              <p className="font-medium">{order.products.length} item(s)</p>
              <p className="font-medium text-lg mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-4">Status: {order.status}</p>
            </div>
          )}
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinueShopping}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-md"
          >
            <FiArrowLeft />
            Continue Shopping
          </motion.button>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewOrders}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md"
          >
            View Your Orders
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess; 