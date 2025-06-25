import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign, 
  FiRefreshCw, 
  FiShoppingCart,
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiSearch
} from 'react-icons/fi';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'products', direction: 'desc' });
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get admin info from localStorage
      const adminInfoStr = localStorage.getItem('userInfo');
      if (!adminInfoStr) {
        toast.error("Admin information not found. Please login again.");
        navigate('/login');
        return;
      }

      const adminInfo = JSON.parse(adminInfoStr);
      // Check if user has admin role - this depends on how your app defines admin users
      if (!adminInfo.isAdmin) {
        toast.error("Access denied. Admin privileges required.");
        navigate('/');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        navigate('/login');
        return;
      }

      // Fetch all sellers
      const sellersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/sellers`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Fetch all users (regular users, not sellers)
      const usersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Fetch all products
      const productsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/products`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Fetch all orders
      const ordersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const sellers = sellersResponse.data || [];
      const users = usersResponse.data || [];
      const products = productsResponse.data || [];
      const orders = ordersResponse.data || [];

      // Process sellers data to include product counts
      const sellersWithStats = sellers.map(seller => {
        const sellerProducts = products.filter(product => 
          product.seller && (product.seller._id === seller._id || product.seller === seller._id)
        );
        
        const sellerOrders = orders.filter(order => {
          // Check if any product in this order belongs to this seller
          return order.products && order.products.some(item => {
            const productId = item.product?._id || item.product;
            const product = products.find(p => p._id === productId);
            return product && (product.seller?._id === seller._id || product.seller === seller._id);
          });
        });
        
        const totalSales = sellerOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
        
        return {
          ...seller,
          products: sellerProducts.length,
          orders: sellerOrders.length,
          sales: totalSales
        };
      });

      // Calculate total stats
      const totalProducts = products.length;
      const totalUsers = users.length;
      const totalSellers = sellers.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

      // Get recently added products
      const recentProducts = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      
      // Get top selling products
      const productSalesMap = {};
      orders.forEach(order => {
        if (order.products) {
          order.products.forEach(item => {
            const productId = item.product?._id || item.product;
            const quantity = item.quantity || 1;
            
            if (!productSalesMap[productId]) {
              productSalesMap[productId] = 0;
            }
            productSalesMap[productId] += quantity;
          });
        }
      });
      
      const topProducts = Object.keys(productSalesMap)
        .map(productId => {
          const product = products.find(p => p._id === productId);
          return {
            product: product || { name: 'Unknown Product', price: 0 },
            soldQuantity: productSalesMap[productId]
          };
        })
        .sort((a, b) => b.soldQuantity - a.soldQuantity)
        .slice(0, 10);

      // Set dashboard data
      setDashboard({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        totalSellers,
        sellers: sellersWithStats,
        recentProducts,
        topProducts
      });

      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      setError(`Failed to load dashboard data: ${error.message}`);
      setRefreshing(false);
      
      // In development, fall back to mock data
      if (process.env.NODE_ENV === 'development') {
        console.log("Using mock data for development");
        mockFetchAdminData().then(data => {
          setDashboard(data);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // For development/demo purposes
  const mockFetchAdminData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random mock data
        const mockSellers = Array.from({ length: 20 }, (_, i) => ({
          _id: `seller_${i + 1}`,
          name: `Seller ${i + 1}`,
          email: `seller${i + 1}@example.com`,
          products: Math.floor(Math.random() * 50) + 1,
          orders: Math.floor(Math.random() * 200) + 1,
          sales: Math.floor(Math.random() * 50000) + 1000,
          status: Math.random() > 0.1 ? 'Active' : 'Inactive',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
        }));

        const mockProducts = Array.from({ length: 30 }, (_, i) => ({
          _id: `product_${i + 1}`,
          name: `Product ${i + 1}`,
          price: Math.floor(Math.random() * 500) + 20,
          stock: Math.floor(Math.random() * 100) + 1,
          seller: mockSellers[Math.floor(Math.random() * mockSellers.length)],
          category: ['Dresses', 'Jackets', 'Shoes', 'Accessories'][Math.floor(Math.random() * 4)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        }));

        const mockTopProducts = Array.from({ length: 10 }, (_, i) => ({
          product: mockProducts[i],
          soldQuantity: Math.floor(Math.random() * 500) + 50
        }));

        resolve({
          totalRevenue: 583750,
          totalOrders: 1243,
          totalProducts: 312,
          totalUsers: 745,
          totalSellers: 48,
          sellers: mockSellers,
          recentProducts: mockProducts.slice(0, 10),
          topProducts: mockTopProducts
        });
      }, 1000);
    });
  };

  useEffect(() => {
    fetchAdminData();
    
    // Refresh data every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchAdminData();
    }, 300000); 
    
    return () => clearInterval(refreshInterval);
  }, [navigate]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdminData();
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSellers = dashboard?.sellers ? [...dashboard.sellers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  }) : [];

  const filteredSellers = sortedSellers.filter(seller => 
    seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-700">No data available</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Complete overview of the platform</p>
        </div>
        <div className="flex space-x-4 items-center">
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={refreshing}
          >
            <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'overview' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`admin-tab ${activeTab === 'sellers' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('sellers')}
        >
          Sellers
        </button>
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-overview">
          <div className="admin-stats-grid">
            <motion.div 
              className="admin-stat-card"
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
            >
              <div className="admin-stat-icon seller-icon">
                <FiUsers size={24} />
              </div>
              <div>
                <h3>Total Sellers</h3>
                <p className="admin-stat-value">{dashboard.totalSellers}</p>
              </div>
            </motion.div>

            <motion.div 
              className="admin-stat-card"
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
            >
              <div className="admin-stat-icon user-icon">
                <FiUsers size={24} />
              </div>
              <div>
                <h3>Total Users</h3>
                <p className="admin-stat-value">{dashboard.totalUsers}</p>
              </div>
            </motion.div>

            <motion.div 
              className="admin-stat-card"
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
            >
              <div className="admin-stat-icon product-icon">
                <FiShoppingBag size={24} />
              </div>
              <div>
                <h3>Total Products</h3>
                <p className="admin-stat-value">{dashboard.totalProducts}</p>
              </div>
            </motion.div>

            <motion.div 
              className="admin-stat-card"
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
            >
              <div className="admin-stat-icon order-icon">
                <FiShoppingCart size={24} />
              </div>
              <div>
                <h3>Total Orders</h3>
                <p className="admin-stat-value">{dashboard.totalOrders}</p>
              </div>
            </motion.div>

            <motion.div 
              className="admin-stat-card revenue-card"
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
            >
              <div className="admin-stat-icon revenue-icon">
                <FiDollarSign size={24} />
              </div>
              <div>
                <h3>Total Revenue</h3>
                <p className="admin-stat-value">${dashboard.totalRevenue.toLocaleString()}</p>
              </div>
            </motion.div>
          </div>

          <div className="admin-charts-grid">
            <div className="admin-chart-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
                <span className="text-sm text-purple-600 font-medium">View All</span>
              </div>
              <div className="space-y-4">
                {dashboard.topProducts.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <FiBarChart2 className="text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">${item.product.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold">{item.soldQuantity} sold</span>
                      <span className="ml-2 text-green-500">
                        <FiTrendingUp />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-chart-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Products</h3>
                <span className="text-sm text-purple-600 font-medium">View All</span>
              </div>
              <div className="space-y-4">
                {dashboard.recentProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <FiShoppingBag className="text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">${product.price}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sellers' && (
        <div className="admin-sellers">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">All Sellers</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:border-purple-400 focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Seller Name</th>
                  <th>Email</th>
                  <th 
                    onClick={() => handleSort('products')}
                    className="sortable-header"
                  >
                    Products
                    {sortConfig.key === 'products' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('orders')}
                    className="sortable-header"
                  >
                    Orders
                    {sortConfig.key === 'orders' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('sales')}
                    className="sortable-header"
                  >
                    Total Sales
                    {sortConfig.key === 'sales' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map((seller) => (
                  <tr key={seller._id}>
                    <td>{seller.name}</td>
                    <td>{seller.email}</td>
                    <td>{seller.products}</td>
                    <td>{seller.orders}</td>
                    <td>${seller.sales.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${seller.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                        {seller.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className="action-button view-button">
                        View
                      </button>
                      <button className="action-button edit-button">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-products">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">All Products</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:border-purple-400 focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="product-grid">
            {dashboard.recentProducts.map((product) => (
              <motion.div 
                key={product._id}
                className="product-card"
                whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
              >
                <div className="product-image">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">
                      <FiShoppingBag size={40} />
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="product-price">${product.price}</span>
                    <span className="product-stock">Stock: {product.stock || 'N/A'}</span>
                  </div>
                  <div className="product-seller">
                    <span>Seller: </span>
                    <span className="seller-name">
                      {product.seller?.name || 'Unknown Seller'}
                    </span>
                  </div>
                  <div className="product-actions">
                    <button className="view-product-btn">View</button>
                    <button className="edit-product-btn">Edit</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 