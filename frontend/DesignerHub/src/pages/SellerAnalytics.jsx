import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'];

const SellerAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get seller info from localStorage
        const sellerInfoStr = localStorage.getItem('sellerInfo');
        const token = localStorage.getItem('sellerToken');
        if (!sellerInfoStr || !token) throw new Error('Seller not authenticated');
        const sellerInfo = JSON.parse(sellerInfoStr);
        const sellerId = sellerInfo.id || sellerInfo._id;

        // Fetch sales by month
        const salesRes = await axios.get(`http://localhost:8000/api/analytics/seller/${sellerId}/sales`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSalesData(salesRes.data || []);

        // Fetch orders by month
        const ordersRes = await axios.get(`http://localhost:8000/api/analytics/seller/${sellerId}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrdersData(ordersRes.data || []);

        // Fetch product category breakdown
        const catRes = await axios.get(`http://localhost:8000/api/analytics/seller/${sellerId}/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategoryData(catRes.data || []);
      } catch (err) {
        // Fallback to mock data for demo
        setError('Failed to load analytics. Showing demo data.');
        setSalesData([
          { month: 'Jan', sales: 1200 },
          { month: 'Feb', sales: 2100 },
          { month: 'Mar', sales: 800 },
          { month: 'Apr', sales: 1600 },
          { month: 'May', sales: 900 },
          { month: 'Jun', sales: 1700 },
        ]);
        setOrdersData([
          { month: 'Jan', orders: 30 },
          { month: 'Feb', orders: 45 },
          { month: 'Mar', orders: 20 },
          { month: 'Apr', orders: 38 },
          { month: 'May', orders: 25 },
          { month: 'Jun', orders: 41 },
        ]);
        setCategoryData([
          { name: 'Jackets', value: 12 },
          { name: 'Shirts', value: 8 },
          { name: 'Sweaters', value: 5 },
          { name: 'Dresses', value: 7 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>
      {loading && <div>Loading analytics...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sales Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Sales Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Orders Per Month */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Orders Per Month</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Product Category Breakdown */}
          <div className="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Product Category Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerAnalytics; 