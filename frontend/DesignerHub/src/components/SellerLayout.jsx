import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaClipboardList, FaChartLine, FaCog, FaUserCircle, FaBell, FaSignOutAlt, FaStore } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import './SellerLayout.css';

const SellerLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Load seller info from localStorage
    const sellerInfoStr = localStorage.getItem('sellerInfo');
    if (!sellerInfoStr) {
      toast.error("You need to log in as a seller first");
      navigate('/seller-login');
      return;
    }

    try {
      const parsedSellerInfo = JSON.parse(sellerInfoStr);
      setSellerInfo(parsedSellerInfo);
      
      // For demo purposes, set some sample notifications
      setNotifications([
        { id: 1, text: 'New order received!', time: '5 minutes ago', unread: true },
        { id: 2, text: 'Product "Summer Dress" is low on stock', time: '1 hour ago', unread: true },
        { id: 3, text: 'Monthly sales report is ready', time: 'Yesterday', unread: false },
      ]);
    } catch (err) {
      console.error("Error parsing seller info:", err);
      navigate('/seller-login');
    }
  }, [navigate]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear seller data from localStorage
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerInfo');
    toast.success("Logged out successfully");
    navigate('/seller-login');
  };

  const getFirstName = () => {
    if (!sellerInfo) return '';
    
    const name = sellerInfo.name || sellerInfo.businessName || '';
    const parts = name.split(' ');
    return parts[0] || '';
  };

  // Navigation to main store
  const goToMainStore = () => {
    navigate('/');
  };

  // Navigation links with icons
  const navLinks = [
    { to: '/seller-dashboard', label: 'Dashboard', icon: <FaHome size={18} /> },
    { to: '/seller-products', label: 'Products', icon: <FaBox size={18} /> },
    { to: '/seller-orders', label: 'Orders', icon: <FaClipboardList size={18} /> },
    { to: '/seller-analytics', label: 'Analytics', icon: <FaChartLine size={18} /> },
    { to: '/seller-settings', label: 'Settings', icon: <FaCog size={18} /> },
  ];

  // Check which nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Seller Navbar */}
      <header className="bg-white shadow-sm z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/seller-dashboard" className="flex items-center seller-portal-logo">
                <span className="text-xl font-bold text-purple-600">DesignerHub</span>
                <span className="ml-2 text-gray-600 text-sm font-medium border-l border-gray-300 pl-2">Seller Portal</span>
              </NavLink>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Visit store button */}
              <button 
                onClick={goToMainStore} 
                className="hidden md:flex items-center text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors"
              >
                <FaStore className="mr-2" /> Visit Store
              </button>
              
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  className="p-1 rounded-full text-gray-600 hover:text-purple-600 focus:outline-none relative transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell size={20} />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-2 divide-y divide-gray-100">
                        <div className="px-4 py-2 text-sm font-medium text-gray-700 flex justify-between items-center">
                          <span>Notifications</span>
                          {notifications.some(n => n.unread) && (
                            <button className="text-xs text-purple-600 hover:text-purple-800">
                              Mark all as read
                            </button>
                          )}
                        </div>
                        
                        {notifications.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                        ) : (
                          notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 hover:bg-gray-50 ${notification.unread ? 'bg-purple-50' : ''}`}
                            >
                              <div className="text-sm font-medium text-gray-900">{notification.text}</div>
                              <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                            </div>
                          ))
                        )}
                        
                        <div className="px-4 py-2 text-xs text-center">
                          <a href="#" className="text-purple-600 hover:text-purple-800">View all notifications</a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 focus:outline-none transition-colors"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                    {getFirstName().charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{getFirstName()}</span>
                </button>
                
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <div className="font-medium">{sellerInfo?.name || sellerInfo?.businessName}</div>
                          <div className="text-xs text-gray-500 truncate">{sellerInfo?.email}</div>
                        </div>
                        
                        <NavLink 
                          to="/seller-profile" 
                          className={({ isActive }) => 
                            `block px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                              isActive ? 'text-purple-600' : 'text-gray-700'
                            }`
                          }
                        >
                          <FaUserCircle className="mr-2" /> Profile
                        </NavLink>
                        
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FaSignOutAlt className="mr-2" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation tabs */}
      <div className="bg-white shadow-sm mb-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 nav-tabs-container">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={`inline-flex items-center px-1 pt-1 pb-2 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(link.to)
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-sm text-gray-500 mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} DesignerHub Seller Portal. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerLayout; 