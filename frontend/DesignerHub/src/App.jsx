import React, { useState, useEffect } from 'react';
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
import SellerProfile from "./pages/SellerProfile";
import User from "./components/user";
import DressesCollection from "./pages/DressesCollection";
import Shop from "./pages/Shop";
import JacketsCollection from "./pages/JacketsCollection";
import PageTransition from "./components/PageTransition";
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import OrderSuccess from './pages/OrderSuccess';
import SellerLayout from './components/SellerLayout';
import AdminDashboard from './pages/AdminDashboard';
import Welcome from './components/Welcome';
import SellerAnalytics from './pages/SellerAnalytics';

// Wrapper component for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const handleAddProduct = (product) => {
    setProducts(prev => [...prev, product]);
  };

  // Check if the current route is a seller route
  const isSellerRoute = location.pathname.startsWith('/seller-');
  
  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Regular routes with main layout */}
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
        <Route path="/checkout" element={
          <PageTransition>
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          </PageTransition>
        } />
        <Route path="/order-success" element={
          <PageTransition>
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
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
        <Route path="/product/:id" element={
          <PageTransition>
            <ProductDetail />
          </PageTransition>
        } />
        
        {/* Admin Dashboard route */}
        <Route path="/admin/dashboard" element={
          <PageTransition>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </PageTransition>
        } />
        
        {/* Seller routes with seller layout */}
        <Route path="/seller-dashboard" element={
          <SellerLayout>
            <PageTransition>
              <SellerDashboard />
            </PageTransition>
          </SellerLayout>
        } />
        <Route path="/add-product" element={
          <SellerLayout>
            <PageTransition>
              <AddProduct onAddProduct={handleAddProduct} />
            </PageTransition>
          </SellerLayout>
        } />
        <Route path="/seller-products" element={
          <SellerLayout>
            <PageTransition>
              <SellerProducts products={products} />
            </PageTransition>
          </SellerLayout>
        } />
        <Route path="/seller-orders" element={
          <SellerLayout>
            <PageTransition>
              <SellerOrders />
            </PageTransition>
          </SellerLayout>
        } />
        <Route path="/seller-profile" element={
          <SellerLayout>
            <PageTransition>
              <SellerProfile />
            </PageTransition>
          </SellerLayout>
        } />
        <Route path="/seller-analytics" element={
          <SellerLayout>
            <PageTransition>
              <SellerAnalytics />
            </PageTransition>
          </SellerLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Show welcome screen for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  // To detect if we're on a seller page for conditional navbar rendering
  const MainAppContent = () => {
    const location = useLocation();
    const isSellerRoute = location.pathname.startsWith('/seller-') && 
                          location.pathname !== '/seller-login' && 
                          location.pathname !== '/seller-signup';
    const isAdminRoute = location.pathname.startsWith('/admin');
    
  return (
      <div className={`min-h-screen flex flex-col ${isSellerRoute || isAdminRoute ? 'bg-gray-50' : 'bg-gray-100'}`}>
        {/* Only show main navbar on non-seller and non-admin routes */}
        {!isSellerRoute && !isAdminRoute && <Navbar />}
        
        <main className={!isSellerRoute && !isAdminRoute ? "flex-grow pt-16" : "flex-grow"}>
            <AnimatedRoutes />
          </main>
          {/* <Footer /> */}
        </div>
    );
  };

  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router>
            <AnimatePresence mode="wait">
              {loading ? <Welcome /> : <MainAppContent />}
            </AnimatePresence>
          </Router>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

