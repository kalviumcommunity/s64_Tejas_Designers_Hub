import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaSearch, FaUserCircle, FaTimes, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './NavBar.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { searchQuery, handleSearch } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const { cartCount } = useCart();

  // Set initial search input value from context
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchInput);
    navigate('/shop');
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
    // Auto-focus on the search input when expanded
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/seller-dashboard', label: 'Sell' },
  ];

  // Add admin link if user has admin privileges
  if (user && user.isAdmin) {
    navLinks.push({ to: '/admin/dashboard', label: 'Admin', icon: <FaLock size={14} className="mr-1" /> });
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 w-full bg-gray-900/80 backdrop-blur-lg z-50 border-b border-white/20"
      style={{
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800 text-gray-300 hover:text-purple-400 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 180 },
                  closed: { rotate: 0 }
                }}
                transition={{ duration: 0.4, ease: [0.6, 0.05, -0.01, 0.9] }}
              >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </motion.div>
            </motion.button>
          </div>

          {/* Brand */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink to="/" className="flex items-center">
              <span className="text-2xl font-extrabold relative">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                  Designer
                </span>
                <span className="text-gray-200 font-light ml-1">Hub</span>
                <motion.span 
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </span>
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.to}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="relative"
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-all duration-300 relative group overflow-hidden flex items-center ${
                      isActive 
                        ? 'text-purple-400' 
                        : 'text-gray-300 hover:text-white'
                    } ${link.to === '/admin/dashboard' ? 'bg-purple-900/50 rounded-full px-4' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.icon && <span className="mr-1">{link.icon}</span>}
                      <span className="relative z-10">{link.label}</span>
                      {isActive ? (
                        <motion.span 
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-500"
                          layoutId="navIndicator"
                        />
                      ) : (
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-700 group-hover:w-full transition-all duration-300" />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <motion.form 
              className="relative w-full"
              initial={false}
              animate={{ 
                width: isSearchOpen ? '100%' : '40px',
                boxShadow: isSearchOpen ? '0 4px 12px rgba(0, 0, 0, 0.05)' : '0 0 0 rgba(0, 0, 0, 0)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onSubmit={handleSearchSubmit}
            >
              <motion.input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Search products..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-800/80 border border-gray-700/50 focus:bg-gray-900 focus:border-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-400 ${
                  isSearchOpen ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  backdropFilter: 'blur(8px)',
                }}
                onFocus={handleSearchFocus}
                onBlur={() => {
                  // Only close if empty
                  if (!searchInput) {
                    setIsSearchOpen(false);
                  }
                }}
                animate={{ 
                  width: isSearchOpen ? '100%' : '0%',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute ${isSearchOpen ? 'left-3' : 'right-2'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 z-10 transition-colors duration-300`}
                onClick={handleSearchFocus}
              >
                <FaSearch />
              </motion.button>
            </motion.form>
          </div>

          {/* Right: Cart, User or Sign in/Register */}
          <div className="flex items-center space-x-6">
            <motion.div 
              whileHover={{ scale: 1.1, y: -2 }} 
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <NavLink to="/cart" className="text-gray-300 hover:text-purple-400 relative transition-colors duration-300">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaShoppingCart size={20} />
                </motion.span>
                {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                >
                  {cartCount}
                </motion.span>
                )}
              </NavLink>
            </motion.div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 focus:outline-none transition-colors duration-300"
                >
                  <FaUserCircle size={22} />
                  <span className="text-sm font-medium hidden lg:inline-block">
                    {user.name || "Account"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-gray-900/95 backdrop-blur-lg border border-gray-700 overflow-hidden"
                      style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    >
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm font-medium text-gray-300">Signed in as</p>
                          <p className="text-sm font-bold text-gray-300 truncate">{user.email || "User"}</p>
                        </div>
                        <NavLink
                          to="/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors duration-150"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="mr-2">👤</span> Your Profile
                        </NavLink>
                        {user.isAdmin && (
                          <NavLink
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors duration-150"
                            onClick={() => setShowDropdown(false)}
                          >
                            <span className="mr-2">⚙️</span> Admin Dashboard
                          </NavLink>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/50 transition-colors duration-150"
                        >
                          <span className="mr-2">👋</span> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <NavLink to="/login" className="text-gray-300 hover:text-purple-400 relative transition-colors duration-300">
                    <FaUserCircle size={24} />
                  </NavLink>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (only shown when mobile menu is open) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 py-2"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full bg-gray-800 focus:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaSearch />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu (only shown when mobile menu is open) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                      isActive ? 'bg-purple-900/50 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <div className="flex items-center justify-center space-x-2">
                   <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full text-center px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full hover:shadow-lg transition-all duration-300"
                    >
                      Login / Register
                    </motion.button>
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;