import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/loginPage";
import Signup from "./pages/signupPage";
import SellerLogin from "./pages/sellerLogin";
import SellerSignup from "./pages/sellerSignup";
import Cart from "./components/cart";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import User from "./components/user";
import DressesCollection from "./pages/DressesCollection";
import Shop from "./pages/Shop";
import JacketsCollection from "./pages/JacketsCollection";

function App() {
  const [products, setProducts] = useState([]);

  const handleAddProduct = (product) => {
    setProducts(prev => [...prev, product]);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/seller-login" element={<SellerLogin />} />
              <Route path="/seller-signup" element={<SellerSignup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/add-product" element={<AddProduct onAddProduct={handleAddProduct} />} />
              <Route path="/seller-products" element={<SellerProducts products={products} />} />
              <Route path="/seller-orders" element={<SellerOrders />} />
              <Route path="/profile" element={<User />} />
              <Route path="/collections/dresses" element={<DressesCollection />} />
              <Route path="/collections/jackets" element={<JacketsCollection />} />
              <Route path="/shop" element={<Shop />} />
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
