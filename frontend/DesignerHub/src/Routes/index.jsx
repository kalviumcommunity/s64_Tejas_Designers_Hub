import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerProducts from '../pages/SellerProducts';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/seller/products" element={<SellerProducts />} />
    </Routes>
  );
};

export default AppRoutes;