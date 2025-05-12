import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiShoppingBag, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user, fetchUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add this function after the handleChange function:

  const validateCartProducts = async (cartItems) => {
    try {
      if (!cartItems || cartItems.length === 0) {
        return { valid: false, message: "Your cart is empty" };
      }
      
      // Check if all cart items have valid product IDs
      const invalidItems = cartItems.filter(item => !item.id);
      
      if (invalidItems.length > 0) {
        return { 
          valid: false, 
          message: `${invalidItems.length} items in your cart have invalid product IDs` 
        };
      }
      
      // This would be a good place to check with the backend if these products exist
      // But for now, we'll just validate their structure
      
      return { valid: true };
    } catch (error) {
      console.error("Error validating cart items:", error);
      return { valid: false, message: "Error validating cart items" };
    }
  };

  // Function to extract user ID from different possible user object structures
  const extractUserId = (userObject) => {
    if (!userObject) return null;
    
    // Direct properties
    if (userObject._id) return userObject._id.toString();
    if (userObject.id) return userObject.id.toString();
    if (userObject.userId) return userObject.userId.toString();
    
    // Nested user object (sometimes happens with API responses)
    if (userObject.user) {
      if (userObject.user._id) return userObject.user._id.toString();
      if (userObject.user.id) return userObject.user.id.toString();
      if (userObject.user.userId) return userObject.user.userId.toString();
    }
    
    // Look for any property that ends with 'id' or 'Id' and is a string or has toString method
    for (const key in userObject) {
      if ((key.endsWith('id') || key.endsWith('Id')) && 
          (typeof userObject[key] === 'string' || 
           typeof userObject[key] === 'object' && userObject[key] !== null)) {
        const idValue = userObject[key].toString();
        // Check if it looks like a MongoDB ObjectID (24 chars, hex)
        if (idValue.length === 24 && /^[0-9a-f]+$/i.test(idValue)) {
          return idValue;
        }
      }
    }
    
    return null;
  };

  const formatOrderData = (user, cartItems, total, formData) => {
    try {
      // Ensure all product IDs are properly formatted
      const formattedProducts = cartItems.map(item => {
        // MongoDB ObjectIDs are normally 24 character hex strings
        const productId = item.id?.toString();
        
        // Check if it looks like a valid ID format
        const isValidIdFormat = typeof productId === 'string' && productId.length === 24;
        
        if (!isValidIdFormat) {
          console.warn(`Potentially invalid product ID: ${productId}`);
        }
        
        return {
          product: productId,
          quantity: item.quantity || 1
        };
      });
      
      // Extract user ID using our helper function
      const userId = extractUserId(user);
      
      if (!userId) {
        throw new Error("Could not find valid user ID in the user object");
      }
      
      return {
        buyer: userId,
        products: formattedProducts,
        status: 'Pending',
        totalAmount: total,
        paymentMethod: formData.paymentMethod === 'credit-card' ? 'Card' : 'PayPal',
        address: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zipCode,
          country: formData.country
        }
      };
    } catch (error) {
      console.error("Error formatting order data:", error);
      throw new Error("Failed to format order data: " + error.message);
    }
  };

  // Add this near the top of the component, right after the state declarations
  useEffect(() => {
    // Check if user is logged in when component mounts
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('You must be logged in to access the checkout page.');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // If user context hasn't loaded the user yet but we have a token
    if ((!user || !extractUserId(user)) && token) {
      console.log("Token exists but user not loaded yet, attempting to refresh user data");
      // This will trigger a re-fetch of user data from the server
      fetchUserProfile();
    }
  }, [user, navigate, fetchUserProfile]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['fullName', 'email', 'address', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    // Validate cart items
    const validation = await validateCartProducts(cartItems);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    
    try {
      setIsProcessing(true);

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to place an order.');
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }

      // Try to get user data from multiple sources and ensure it has a valid ID
      let orderUser = user;
      let userId = orderUser ? extractUserId(orderUser) : null;
      
      // If no valid user ID from context, try localStorage
      if (!userId) {
        console.log("Valid user ID not available in context, checking localStorage...");
        
        try {
          // Try to get user info from localStorage as a backup
          const userStr = localStorage.getItem('userInfo');
          if (userStr) {
            const localUser = JSON.parse(userStr);
            const localUserId = extractUserId(localUser);
            
            if (localUserId) {
              orderUser = localUser;
              userId = localUserId;
              console.log("Using user data from localStorage, ID:", userId);
            } else {
              console.error("User data in localStorage doesn't have a valid ID");
            }
          } else {
            console.error("No user data found in localStorage");
          }
        } catch (err) {
          console.error("Error processing user data from localStorage:", err);
        }
      }

      // If still no valid user ID, try to get it directly from token
      if (!userId && token) {
        try {
          // Try to fetch user profile one more time
          console.log("Attempting one final user profile fetch");
          await fetchUserProfile();
          
          // Check if user context was updated
          if (user && extractUserId(user)) {
            orderUser = user;
            userId = extractUserId(user);
            console.log("Successfully retrieved user data from profile refresh, ID:", userId);
          }
        } catch (err) {
          console.error("Failed to refresh user profile:", err);
        }
      }

      // Final check if we have user data from any source
      if (!userId) {
        console.error("Unable to retrieve user data from context or localStorage");
        toast.error('User information not available. Please log in again.');
        // Add a delay before redirecting to make sure the error is visible
        setTimeout(() => {
          // Clear any potentially corrupted user data
          localStorage.removeItem('userInfo');
          navigate('/login', { state: { from: '/checkout' } });
        }, 1500);
        return;
      }

      // Debug: Log the cart items to verify they have valid IDs
      console.log("Cart items for order:", cartItems);
      console.log("Using user data with ID:", userId);

      // Format order data using the user data we've determined
      const orderData = formatOrderData(orderUser, cartItems, total, formData);

      // Debug: Log the order data
      console.log("Sending order data:", orderData);

      // Send order to backend
      console.log("Sending order to API with token:", token.substring(0, 10) + "...");
      
      const response = await axios.post('http://localhost:8000/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if response was successful
      if (response.status !== 201) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      // Save order details for success page
      const createdOrder = response.data.order;
      if (!createdOrder || !createdOrder._id) {
        console.error("API returned success but order data is invalid:", response.data);
        throw new Error("Server returned invalid order data");
      }
      
      setOrderDetails(createdOrder);
      
      // Store order info in localStorage for the success page
      localStorage.setItem('lastOrder', JSON.stringify(createdOrder));
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Navigate to success page
      navigate('/order-success');
    } catch (error) {
      console.error('Error processing order:', error);
      
      // Display more helpful error message
      if (error.response) {
        // The server responded with an error status
        const errorMsg = error.response.data.message || 'Failed to process your order.';
        toast.error(`Order Error: ${errorMsg}`);
        
        // If there are validation errors, show them
        if (error.response.data.details) {
          toast.error(`Validation errors: ${error.response.data.details}`);
        }
        
        // If we got a 401, the token might be invalid
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          toast.error('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 1500);
        }
      } else if (error.request) {
        // The request was made but no response received
        toast.error('Server did not respond. Please check your internet connection.');
      } else {
        // Something else caused the error
        toast.error('Error creating order: ' + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="checkout-empty"
      >
        <FiShoppingBag className="text-gray-400 text-5xl mb-4" />
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart before proceeding to checkout.</p>
        <motion.button 
          onClick={() => navigate('/shop')} 
          className="continue-shopping-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft className="inline mr-2" /> Continue Shopping
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="checkout-container"
    >
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="checkout-title"
      >
        Checkout
      </motion.h1>
      
      <div className="checkout-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="checkout-form-container"
        >
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Shipping Information</h2>
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name*</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address*</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City*</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State/Province*</label>
                  <input 
                    type="text" 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP/Postal Code*</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    name="zipCode" 
                    value={formData.zipCode} 
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country*</label>
                  <input 
                    type="text" 
                    id="country" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Payment Details</h2>
              
              <div className="payment-methods">
                <div className="payment-method">
                  <input 
                    type="radio" 
                    id="credit-card" 
                    name="paymentMethod" 
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleChange}
                  />
                  <label htmlFor="credit-card"><FiCreditCard className="inline mr-2" /> Credit Card</label>
                </div>
                
                <div className="payment-method">
                  <input 
                    type="radio" 
                    id="paypal" 
                    name="paymentMethod" 
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  <label htmlFor="paypal"><FiDollarSign className="inline mr-2" /> PayPal</label>
                </div>
              </div>
              
              {formData.paymentMethod === 'credit-card' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="credit-card-inputs"
                >
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number*</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      name="cardNumber" 
                      value={formData.cardNumber} 
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cardExpiry">Expiry Date*</label>
                      <input 
                        type="text" 
                        id="cardExpiry" 
                        name="cardExpiry" 
                        value={formData.cardExpiry} 
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardCvc">CVC/CVV*</label>
                      <input 
                        type="text" 
                        id="cardCvc" 
                        name="cardCvc" 
                        value={formData.cardCvc} 
                        onChange={handleChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {formData.paymentMethod === 'paypal' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="paypal-message"
                >
                  <p>You will be redirected to PayPal to complete your payment.</p>
                </motion.div>
              )}
            </div>
            
            <div className="checkout-buttons">
              <motion.button 
                type="button" 
                className="back-to-cart-btn"
                onClick={() => navigate('/cart')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiArrowLeft className="inline mr-2" /> Back to Cart
              </motion.button>
              
              <motion.button 
                type="submit" 
                className={`place-order-btn ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing}
                whileHover={!isProcessing ? { scale: 1.05 } : {}}
                whileTap={!isProcessing ? { scale: 0.95 } : {}}
              >
                {isProcessing ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
              </motion.button>
            </div>
          </form>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="order-summary"
        >
          <h2>Order Summary</h2>
          
          <div className="order-items">
            {cartItems.map((item) => (
              <motion.div 
                key={`${item.id}-${item.size}`} 
                className="order-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-size">Size: {item.size || 'N/A'}</p>
                  <p className="item-quantity">Qty: {item.quantity}</p>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="order-totals">
            <motion.div 
              className="total-row"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </motion.div>
            
            <motion.div 
              className="total-row"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </motion.div>
            
            <motion.div 
              className="total-row"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </motion.div>
            
            <motion.div 
              className="total-row total"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Checkout; 