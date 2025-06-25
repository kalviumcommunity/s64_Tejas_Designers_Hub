import React, { useEffect, useState } from 'react';
import './SellerDashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiClock, FiPackage, FiXCircle, FiRefreshCw, FiPlus } from 'react-icons/fi';

const SellerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get seller info from localStorage
      const sellerInfoStr = localStorage.getItem('sellerInfo');
      if (!sellerInfoStr) {
        toast.error("Seller information not found. Please login again.");
        navigate('/seller-login');
        return;
      }
      
      const sellerInfo = JSON.parse(sellerInfoStr);
      const sellerId = sellerInfo.id || sellerInfo._id;
      const token = localStorage.getItem('sellerToken');
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        navigate('/seller-login');
        return;
      }
      
      // Fetch recent orders
      const ordersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/seller/${sellerId}/recent?limit=10`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Fetch products for this seller
      const productsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/seller/${sellerId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Calculate totals from orders
      const orders = ordersResponse.data || [];
      const products = productsResponse.data || [];
      
      let totalSales = 0;
      let totalOrdersCount = 0;
      
      // Fetch all orders to calculate totals
      const allOrdersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/seller/${sellerId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const allOrders = allOrdersResponse.data || [];
      totalOrdersCount = allOrders.length;
      
      // Handle case where an order might not have a totalAmount field
      allOrders.forEach(order => {
        // Sum up total sales amount
        if (order.totalAmount && !isNaN(order.totalAmount)) {
          totalSales += Number(order.totalAmount);
        } else {
          console.warn("Order without valid totalAmount:", order._id);
        }
      });
      
      // Get unique customer count - safely handling potentially missing buyer fields
      const uniqueCustomers = new Set();
      allOrders.forEach(order => {
        if (order.buyer) {
          const buyerId = order.buyer._id || order.buyer;
          if (buyerId) {
            uniqueCustomers.add(buyerId.toString());
          }
        }
      });
      
      // Format recent orders more safely with fallbacks for missing data
      const formattedRecentOrders = orders.map(order => {
        let productName = 'Unknown Product';
        let productCount = 0;
        
        // Safely extract product information
        if (Array.isArray(order.products) && order.products.length > 0) {
          productCount = order.products.length;
          const firstProduct = order.products[0];
          
          if (firstProduct && firstProduct.product) {
            productName = firstProduct.product.name || 'Product';
          }
        }
        
        // Format multi-product orders
        const productDisplay = productCount > 1 
          ? `${productName} +${productCount - 1} more` 
          : productName;
        
        return {
          id: order._id || 'NO-ID',
          customer: order.buyer?.name || order.buyer?.email || 'Anonymous',
          product: productDisplay,
          amount: Number(order.totalAmount) || 0,
          status: order.status || 'Pending',
          date: order.createdAt 
            ? new Date(order.createdAt).toLocaleDateString() 
            : new Date().toLocaleDateString()
        };
      });
      
      // Set dashboard data with real numbers
      setDashboard({
        totalSales: totalSales,
        totalOrders: totalOrdersCount,
        totalProducts: products.length,
        totalCustomers: uniqueCustomers.size,
        salesChange: 0, // Placeholder - would need historical data
        ordersChange: 0, // Placeholder
        productsChange: 0, // Placeholder
        customersChange: 0, // Placeholder
        recentOrders: formattedRecentOrders
      });
      
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
      setRefreshing(false);
      
      // Only fall back to mock data if in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log("Using mock data for development");
        mockFetchDashboardData().then(data => {
          setDashboard(data);
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 300000); // 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, [navigate]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // For development/demo purposes
  const mockFetchDashboardData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalSales: 24780,
          totalOrders: 1463,
          totalProducts: 246,
          totalCustomers: 892,
          salesChange: 12.5,
          ordersChange: 8.2,
          productsChange: 24,
          customersChange: 34,
          recentOrders: [
            {
              id: '#ORD-7246',
              customer: 'Sarah Johnson',
              product: 'iPhone 14 Pro',
              amount: 999.0,
              status: 'Completed',
              date: '2023-06-15'
            },
            {
              id: '#ORD-7245',
              customer: 'Michael Brown',
              product: 'MacBook Air',
              amount: 1298.0,
              status: 'Pending',
              date: '2023-06-14'
            },
            {
              id: '#ORD-7244',
              customer: 'Emily Davis',
              product: 'AirPods Pro',
              amount: 248.0,
              status: 'Processing',
              date: '2023-06-14'
            },
          ],
        });
      }, 1000);
    });
  };

  // Display appropriate status icon based on order status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
      case 'Delivered':
        return <FiCheckCircle className="status-icon" />;
      case 'Pending':
        return <FiClock className="status-icon" />;
      case 'Processing':
      case 'Shipped':
        return <FiPackage className="status-icon" />;
      case 'Cancelled':
        return <FiXCircle className="status-icon" />;
      default:
        return null;
    }
  };

  if (loading && !dashboard) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  if (error && !dashboard) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!dashboard) {
    return <div className="dashboard-loading">No data available</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-actions">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/add-product')}
            className="add-product-button"
          >
            <FiPlus className="mr-2" /> Add Product
          </button>
          <button 
            onClick={handleRefresh}
            className="refresh-button"
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? "rotate" : ""} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <section className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-title">Total Sales</div>
          <div className="card-value">${dashboard.totalSales.toLocaleString()}</div>
          <div className="card-sub green">+{dashboard.salesChange}% from last month</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Orders</div>
          <div className="card-value">{dashboard.totalOrders.toLocaleString()}</div>
          <div className="card-sub blue">+{dashboard.ordersChange}% from last month</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Products</div>
          <div className="card-value">{dashboard.totalProducts.toLocaleString()}</div>
          <div className="card-sub orange">+{dashboard.productsChange}% from last month</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Customers</div>
          <div className="card-value">{dashboard.totalCustomers.toLocaleString()}</div>
          <div className="card-sub purple">+{dashboard.customersChange}% from last month</div>
        </div>
      </section>
      
      <section className="dashboard-orders-section">
        <div className="orders-header">
          <h2>Recent Orders</h2>
          <a href="#" className="orders-view-all" onClick={(e) => {e.preventDefault(); navigate('/seller-orders')}}>View All</a>
        </div>
        {dashboard.recentOrders.length === 0 ? (
          <div className="no-orders-message">No orders found. When you receive orders, they will appear here.</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{typeof order.id === 'string' && order.id.startsWith('#') 
                    ? order.id 
                    : `#${order.id.slice(-6).toUpperCase()}`}
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>${order.amount?.toLocaleString() || 0}</td>
                  <td>
                    <span className={`order-status ${(order.status || '').toLowerCase()}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      
      <section className="dashboard-actions">
        <div className="dashboard-action">
          <h3 className="action-title">Store Performance</h3>
          <p className="action-desc">View detailed analytics of your store's performance over time.</p>
          <button className="action-btn blue" onClick={() => navigate('/seller-analytics')}>
            View Analytics
          </button>
        </div>
        <div className="dashboard-action">
          <h3 className="action-title">Manage Products</h3>
          <p className="action-desc">Update your product inventory, prices, and details.</p>
          <button className="action-btn purple" onClick={() => navigate('/seller-products')}>
            Manage Products
          </button>
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
