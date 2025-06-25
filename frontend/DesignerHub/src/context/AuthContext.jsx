import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utility function to safely extract user ID from any user object format
  const extractUserId = (userObject) => {
    if (!userObject) return null;
    
    // Direct properties
    if (userObject._id) return userObject._id.toString();
    if (userObject.id) return userObject.id.toString();
    if (userObject.userId) return userObject.userId.toString();
    
    // Nested user property
    if (userObject.user) {
      if (userObject.user._id) return userObject.user._id.toString();
      if (userObject.user.id) return userObject.user.id.toString();
    }
    
    return null;
  };

  // Function to validate token structure
  const isValidToken = (token) => {
    if (!token || typeof token !== 'string') return false;
    
    // Basic check: JWT tokens are three base64 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  };

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !isValidToken(token)) {
        console.log("No valid token found, clearing auth state");
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
        setLoading(false);
        return;
      }

      // First check if we have user data in localStorage
      const storedUserData = localStorage.getItem('userInfo');
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          // Verify the user data has an ID before using it
          if (extractUserId(parsedUserData)) {
            console.log("Using cached user data from localStorage");
            setUser(parsedUserData);
          } else {
            console.warn("Cached user data is missing ID, will fetch from server");
          }
        } catch (err) {
          console.error("Error parsing user data from localStorage:", err);
          localStorage.removeItem('userInfo');
        }
      }

      // Regardless of localStorage data, still try to fetch from server for freshness
      console.log("Fetching user profile from server");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        
        // Verify the received user data has an ID
        if (data.user && extractUserId(data.user)) {
          setUser(data.user);
          console.log("Updated user data from server:", data.user);
          
          // Update localStorage with fresh data
          localStorage.setItem('userInfo', JSON.stringify(data.user));
        } else {
          console.error("Server returned user data without valid ID:", data);
          throw new Error("Invalid user data received from server");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Profile fetch failed:", response.status, errorData);
        
        // Only clear on 401/403 errors, not on network issues
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Don't automatically clear token on network errors
      // This allows app to work offline with cached user data
      if (error.message.includes('Unauthorized') || error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check for token and fetch user data on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (userData) => {
    try {
      // Validate user data has ID before setting
      if (userData && extractUserId(userData)) {
        setUser(userData);
        // Also store in localStorage as backup
        localStorage.setItem('userInfo', JSON.stringify(userData));
        console.log("User authenticated successfully:", userData);
        return true;
      } else {
        console.error("Login failed: Invalid user data received", userData);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 