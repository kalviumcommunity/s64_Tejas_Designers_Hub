import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPackage, FiUser, FiDollarSign, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const statusColors = {
  Completed: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-200 text-green-900',
  Cancelled: 'bg-red-100 text-red-700',
};

const statusIcons = {
  Completed: <FiCheckCircle className="inline mr-1" />,
  Pending: <FiClock className="inline mr-1" />,
  Processing: <FiPackage className="inline mr-1" />,
  Shipped: <FiPackage className="inline mr-1" />,
  Delivered: <FiCheckCircle className="inline mr-1" />,
  Cancelled: <FiXCircle className="inline mr-1" />,
};

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const sellerInfoStr = localStorage.getItem('sellerInfo');
        if (!sellerInfoStr) {
          setError('Seller information not found. Please login again.');
          return;
        }
        
        const sellerInfo = JSON.parse(sellerInfoStr);
        console.log('Seller info:', sellerInfo);
        const sellerId = sellerInfo.id || sellerInfo._id;
        
        if (!sellerId) {
          setError('Invalid seller information (no ID found). Please login again.');
          console.error('Seller info missing ID:', sellerInfo);
          return;
        }
        
        const token = localStorage.getItem('sellerToken');
        if (!token) {
          setError('Authentication token not found. Please login again.');
          return;
        }
        
        console.log(`Fetching orders for seller ID: ${sellerId}`);
        
        const res = await axios.get(`http://localhost:8000/api/orders/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Orders response:', res.data);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        let errorMessage = 'Failed to fetch orders. ';
        
        if (err.response) {
          // Server responded with a status code outside of 2xx range
          errorMessage += err.response.data?.message || `Server error: ${err.response.status}`;
          console.error('Response error:', err.response.data);
          setDetailedError(JSON.stringify(err.response.data, null, 2));
        } else if (err.request) {
          // Request was made but no response received
          errorMessage += 'No response from server. Please check your connection.';
          setDetailedError('Network error - request sent but no response received');
        } else {
          // Error setting up the request
          errorMessage += err.message;
          setDetailedError(err.stack);
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FiPackage className="text-purple-500" /> Orders
      </h2>
      {loading ? (
        <div className="text-center text-lg text-purple-500 py-12">Loading orders...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">
          <div>{error}</div>
          {detailedError && (
            <details className="mt-4 p-4 bg-red-50 rounded text-left">
              <summary className="cursor-pointer">View technical details</summary>
              <pre className="text-xs text-red-800 mt-2 overflow-auto">
                {detailedError}
              </pre>
            </details>
          )}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-purple-700">{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    {order.buyer?.name || order.buyer?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc ml-4">
                      {order.products.map((item, idx) => (
                        <li key={idx}>{item.product?.name || 'Product'} x{item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-700 flex items-center gap-1">
                    <FiDollarSign />
                    {order.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-200 text-gray-700'}`}>
                      {statusIcons[order.status] || null}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerOrders; 