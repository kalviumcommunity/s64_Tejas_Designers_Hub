import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaVenusMars, FaPencilAlt, FaListUl, FaUserCircle } from 'react-icons/fa';
import Orders from './Orders';
import './user.css';

const User = () => {
  const { user, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully');
        fetchUserProfile(); // Refresh user data
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="dh-user-container">
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="dh-user-container">
      <div className="dh-user-header">
        <h2>My Account</h2>
        {activeTab === 'profile' && (
          <button
            className="dh-edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            <FaPencilAlt /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        )}
      </div>

      <div className="dh-tabs">
        <button 
          className={`dh-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUserCircle /> Profile
        </button>
        <button 
          className={`dh-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaListUl /> My Orders
        </button>
      </div>

      {error && <div className="dh-error-message">{error}</div>}
      {success && <div className="dh-success-message">{success}</div>}

      {activeTab === 'profile' ? (
        <form onSubmit={handleSubmit} className="dh-user-form">
          <div className="dh-form-group">
            <FaUser className="dh-form-icon" />
            <div className="dh-input-group">
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                disabled={!isEditing}
              />
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="dh-form-group">
            <FaEnvelope className="dh-form-icon" />
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="Email"
              disabled={true} // Email should not be editable
            />
          </div>

          <div className="dh-form-group">
            <FaVenusMars className="dh-form-icon" />
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="dh-select-input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {isEditing && (
            <button type="submit" className="dh-save-button">
              Save Changes
            </button>
          )}
        </form>
      ) : (
        <Orders />
      )}
    </div>
  );
};

export default User;
