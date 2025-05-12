import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBox, FaCalendarAlt, FaDollarSign, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaShippingFast } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You need to be logged in to view your orders');
          setLoading(false);
          return;
        }
        
        console.log("Token found, user ID:", user._id);
        
        try {
          // Try main endpoint first
          console.log("Fetching orders from API...");
          const response = await fetch('http://localhost:8000/api/orders/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          console.log("Orders response status:", response.status);
          
          if (!response.ok) {
            // If failed, try the test endpoint
            console.log("Testing API connection...");
            const testResponse = await fetch('http://localhost:8000/api/orders/test');
            
            if (!testResponse.ok) {
              console.error("API test endpoint also failed:", testResponse.status);
              throw new Error(`API is unreachable. Test endpoint returned ${testResponse.status}`);
            } else {
              console.log("Test endpoint works but user orders endpoint failed");
              throw new Error(`Could not fetch orders. Server returned ${response.status}`);
            }
          }
          
          const data = await response.json();
          console.log(`Received ${data.length} orders`);
          setOrders(data);
        } catch (apiError) {
          console.error("API Error:", apiError);
          setError(`${apiError.message}`);
        }
      } catch (err) {
        console.error('Error in fetchOrders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const toggleOrderDetails = (orderId) => {
    if (activeOrderId === orderId) {
      setActiveOrderId(null);
    } else {
      setActiveOrderId(orderId);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'status-completed';
      case 'processing':
      case 'shipped':
        return 'status-processing';
      case 'pending':
      case 'payment pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <FaCheckCircle />;
      case 'processing':
      case 'shipped':
        return <FaShippingFast />;
      case 'pending':
      case 'payment pending':
        return <FaCalendarAlt />;
      case 'cancelled':
        return <FaTimesCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <FaInfoCircle />
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <FaBox className="empty-icon" />
        <h3>No Orders Found</h3>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header" onClick={() => toggleOrderDetails(order._id)}>
              <div className="order-basic-info">
                <span className="order-id">Order #{order._id.slice(-6)}</span>
                <span className="order-date">
                  <FaCalendarAlt /> {formatDate(order.createdAt)}
                </span>
              </div>
              
              <div className="order-summary">
                <span className="order-amount">
                  <FaDollarSign /> ${order.totalAmount.toFixed(2)}
                </span>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
            </div>

            {activeOrderId === order._id && (
              <div className="order-details">
                <div className="order-items">
                  <h4>Order Items</h4>
                  <div className="item-list">
                    {order.products.map((item, index) => (
                      <div key={index} className="item-row">
                        <div className="item-image">
                          {item.product?.images?.[0] ? (
                            <img src={`http://localhost:8000/uploads/${item.product.images[0]}`} alt={item.product.name} />
                          ) : (
                            <div className="placeholder-image">No Image</div>
                          )}
                        </div>
                        <div className="item-info">
                          <h5>{item.product?.name || 'Product Unavailable'}</h5>
                          <p className="item-price">${item.price?.toFixed(2) || '0.00'}</p>
                          <p className="item-quantity">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-summary-details">
                  <div className="order-address">
                    <h4>Shipping Address</h4>
                    <p>{order.shippingAddress?.street}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                    <p>{order.shippingAddress?.country}</p>
                  </div>

                  <div className="order-payment">
                    <h4>Payment Details</h4>
                    <div className="payment-row">
                      <span>Subtotal:</span>
                      <span>${(order.totalAmount - (order.shippingCost || 0)).toFixed(2)}</span>
                    </div>
                    <div className="payment-row">
                      <span>Shipping:</span>
                      <span>${(order.shippingCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="payment-row total">
                      <span>Total:</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
