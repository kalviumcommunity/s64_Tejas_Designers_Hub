import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaSearch, FaUserCircle } from 'react-icons/fa';
import './NavBar.css';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
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

  return (
    <nav className="dh-navbar-bg">
      {/* Brand */}
      <span className="dh-navbar-brand">DesignerHub</span>
      {/* Search Bar */}
      <div className="dh-navbar-searchbar">
        <FaBars className="dh-navbar-searchicon dh-navbar-searchicon-left" />
        <input
          type="text"
          placeholder="Fashion"
          className="dh-navbar-searchinput"
        />
        <FaSearch className="dh-navbar-searchicon dh-navbar-searchicon-right" />
      </div>
      {/* Right: Cart, User or Sign in/Register */}
      <div className="dh-navbar-actions">
        <NavLink to="/cart" className="dh-navbar-cart">
          <FaShoppingCart />
        </NavLink>
        {user ? (
          <div className="dh-navbar-user-wrap" ref={dropdownRef}>
            <button 
              className="dh-navbar-profile-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaUserCircle className="dh-navbar-user-icon" size={28} />
            </button>
            {showDropdown && (
              <div className="dh-navbar-dropdown">
                <NavLink 
                  to="/profile" 
                  className="dh-navbar-dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </NavLink>
                <button 
                  className="dh-navbar-dropdown-item"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/login" className="dh-navbar-signin">Sign in</NavLink>
            <NavLink to="/signup" className="dh-navbar-register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;