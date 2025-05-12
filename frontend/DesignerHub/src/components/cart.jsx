import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// Product images
const productImages = {
  'BOMBER JACKET': '/images/bomber-jacket.jpg',
  'TAILORED JACKET': '/images/tailored-jacket.jpg',
  'COAT': '/images/coat.jpg',
  'HIGH-NECK SWEATER': '/images/sweater.jpg'
};

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const salesTax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + salesTax + shipping;

  const handleGoShopping = () => {
    navigate('/shop');
  };

  const handleRemoveItem = (id, size) => {
    removeFromCart(id, size);
  };

  const handleUpdateQuantity = (id, change, size) => {
    updateQuantity(id, change, size);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Cart Items */}
          <div className="flex-grow">
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-2xl font-normal mb-6 flex items-center gap-2"
            >
              <FiShoppingBag className="text-gray-600" />
              Shopping Cart
            </motion.h1>
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoShopping}
                    className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md"
                  >
                    <FiArrowLeft /> Continue Shopping
                  </motion.button>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-6 pb-6 mb-6 border-b border-gray-200"
                >
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg shadow-sm"
                    >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100';
                        }}
                    />
                    </motion.div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                        <h3 className="text-lg font-normal">{item.name}</h3>
                          {item.category && (
                            <p className="text-sm text-gray-600 mt-1">Category: {item.category}</p>
                          )}
                          {item.size && (
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                          )}
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiX size={20} />
                        </motion.button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleUpdateQuantity(item.id, -1, item.size)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 rounded-md"
                        >
                          -
                          </motion.button>
                          <motion.span 
                            key={item.quantity}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="w-8 text-center"
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleUpdateQuantity(item.id, 1, item.size)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 rounded-md"
                        >
                          +
                          </motion.button>
                      </div>
                        <motion.div className="text-right">
                          <motion.p 
                            key={item.price * item.quantity}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="text-lg font-medium"
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </motion.p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </motion.div>
                    </div>
                  </div>
                </motion.div>
                ))
              )}
            </AnimatePresence>

            {cartItems.length > 0 && (
              <div className="flex justify-between mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoShopping}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <FiArrowLeft /> Continue Shopping
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear Cart
                </motion.button>
            </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-80"
            >
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-normal mb-4">Order Summary</h2>
              <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-between"
                  >
                  <span>Subtotal</span>
                    <motion.span
                      key={subtotal}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                    >
                      ${subtotal.toFixed(2)}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-between text-gray-600"
                  >
                    <span>Tax (5%)</span>
                    <span>${salesTax.toFixed(2)}</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-between text-gray-600"
                  >
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4 border-t border-gray-200"
                  >
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                      <motion.span
                        key={total}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                      >
                        ${total.toFixed(2)}
                      </motion.span>
                  </div>
                  </motion.div>
              </div>
              <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white py-3 mt-6 rounded-md hover:bg-gray-900 transition-colors"
                  onClick={() => navigate('/checkout')}
              >
                PROCEED TO CHECKOUT
              </motion.button>
            </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
  