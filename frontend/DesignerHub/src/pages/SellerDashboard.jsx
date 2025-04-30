import React, { useEffect, useState } from 'react';
import './SellerDashboard.css';
import { useNavigate } from 'react-router-dom';

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
          },
          {
            id: '#ORD-7245',
            customer: 'Michael Brown',
            product: 'MacBook Air',
            amount: 1298.0,
            status: 'Pending',
          },
          {
            id: '#ORD-7244',
            customer: 'Emily Davis',
            product: 'AirPods Pro',
            amount: 248.0,
            status: 'Processing',
          },
        ],
      });
    }, 1000);
  });
};

const SellerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    mockFetchDashboardData().then(setDashboard);
  }, []);

  if (!dashboard) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="sidebar-title">SellerHub</div>
        <nav className="sidebar-nav">
          <a href="#" className="active" onClick={e => {e.preventDefault(); navigate('/seller-dashboard')}}>Dashboard</a>
          <a href="#" onClick={e => {e.preventDefault(); navigate('/seller-products')}}>Products</a>
          <a href="#" onClick={e => {e.preventDefault(); navigate('/seller-orders')}}>Orders</a>
          <a href="#">Analytics</a>
          <a href="#">Payments</a>
          <a href="#">Settings</a>
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back, John! Here's what's happening with your store today.</p>
          </div>
          <div className="dashboard-profile">
            <span className="dashboard-bell">🔔</span>
            <span className="dashboard-avatar"></span>
          </div>
        </header>
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
            <div className="card-title">Total Products</div>
            <div className="card-value">{dashboard.totalProducts}</div>
            <div className="card-sub purple">+{dashboard.productsChange} new products</div>
          </div>
          <div className="dashboard-card">
            <div className="card-title">Total Customers</div>
            <div className="card-value">{dashboard.totalCustomers}</div>
            <div className="card-sub orange">+{dashboard.customersChange} new customers</div>
          </div>
        </section>
        <section className="dashboard-orders-section">
          <div className="orders-header">
            <h2>Recent Orders</h2>
            <a href="#" className="orders-view-all">View All</a>
          </div>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>${order.amount.toLocaleString()}</td>
                  <td>
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="dashboard-actions">
          <div className="dashboard-action add-product">
            <div className="action-title">Add New Product</div>
            <div className="action-desc">Quickly add a new product to your store inventory</div>
            <button className="action-btn purple" onClick={() => navigate('/add-product')}>Add Product</button>
          </div>
          <div className="dashboard-action view-analytics">
            <div className="action-title">View Analytics</div>
            <div className="action-desc">Check detailed analytics about your store performance</div>
            <button className="action-btn blue">View Report</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SellerDashboard;
