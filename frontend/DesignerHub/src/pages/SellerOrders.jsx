import React from 'react';

const mockOrders = [
  { id: '#ORD-7246', customer: 'Sarah Johnson', product: 'iPhone 14 Pro', amount: 999, status: 'Completed' },
  { id: '#ORD-7245', customer: 'Michael Brown', product: 'MacBook Air', amount: 1298, status: 'Pending' },
  { id: '#ORD-7244', customer: 'Emily Davis', product: 'AirPods Pro', amount: 248, status: 'Processing' },
];

const SellerOrders = () => (
  <div className="seller-orders-root">
    <h2>Orders</h2>
    <table className="seller-orders-table">
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
        {mockOrders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.product}</td>
            <td>${order.amount}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SellerOrders; 