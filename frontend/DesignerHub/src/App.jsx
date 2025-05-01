import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
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
import PageTransition from "./components/PageTransition";

// Wrapper component for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const handleAddProduct = (product) => {
    setProducts(prev => [...prev, product]);
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/signup" element={
          <PageTransition>
            <Signup />
          </PageTransition>
        } />
        <Route path="/seller-login" element={
          <PageTransition>
            <SellerLogin />
          </PageTransition>
        } />
        <Route path="/seller-signup" element={
          <PageTransition>
            <SellerSignup />
          </PageTransition>
        } />
        <Route path="/cart" element={
          <PageTransition>
            <Cart />
          </PageTransition>
        } />
        <Route path="/seller-dashboard" element={
          <PageTransition>
            <SellerDashboard />
          </PageTransition>
        } />
        <Route path="/add-product" element={
          <PageTransition>
            <AddProduct onAddProduct={handleAddProduct} />
          </PageTransition>
        } />
        <Route path="/seller-products" element={
          <PageTransition>
            <SellerProducts products={products} />
          </PageTransition>
        } />
        <Route path="/seller-orders" element={
          <PageTransition>
            <SellerOrders />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <User />
          </PageTransition>
        } />
        <Route path="/collections/dresses" element={
          <PageTransition>
            <DressesCollection />
          </PageTransition>
        } />
        <Route path="/collections/jackets" element={
          <PageTransition>
            <JacketsCollection />
          </PageTransition>
        } />
        <Route path="/shop" element={
          <PageTransition>
            <Shop />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Navbar />
          <main className="flex-grow pt-16">
            <AnimatedRoutes />
          </main>
          {/* <Footer /> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
