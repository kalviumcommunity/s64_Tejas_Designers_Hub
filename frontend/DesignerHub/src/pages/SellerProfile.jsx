import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiSave, FiX, FiShoppingBag, FiCalendar, FiGlobe, FiDollarSign, FiHelpCircle, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellerProfile = () => {
  const navigate = useNavigate();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    bio: '',
    website: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    businessType: '',
    taxId: ''
  });

  const fetchSellerProfile = async () => {
    try {
      setLoading(true);
      
      // Get token for authentication
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        navigate('/seller-login');
        return;
      }
      
      // First get basic seller info from localStorage as fallback
      const sellerInfoStr = localStorage.getItem('sellerInfo');
      let parsedSellerInfo = null;
      
      if (sellerInfoStr) {
        try {
          parsedSellerInfo = JSON.parse(sellerInfoStr);
          // Use this as initial data while we fetch from API
          setSellerInfo(parsedSellerInfo);
          initializeFormData(parsedSellerInfo);
        } catch (err) {
          console.error("Error parsing seller info from localStorage:", err);
        }
      }
      
      // Fetch detailed seller profile from API
      const sellerId = parsedSellerInfo?._id || parsedSellerInfo?.id;
      
      if (!sellerId) {
        toast.error("Seller ID not found. Please login again.");
        navigate('/seller-login');
        return;
      }
      
      try {
        // Make API call to get seller profile
        console.log("Fetching seller profile from API...");
        const response = await axios.get(
          `http://localhost:8000/api/seller-auth/${sellerId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data && response.data.seller) {
          const fetchedSellerData = response.data.seller;
          console.log("Fetched seller data:", fetchedSellerData);
          
          // Update seller info in state and localStorage for future use
          setSellerInfo(fetchedSellerData);
          localStorage.setItem('sellerInfo', JSON.stringify(fetchedSellerData));
          
          // Initialize form with fetched data
          initializeFormData(fetchedSellerData);
        } else {
          console.warn("API returned empty or invalid seller data");
          
          // If API fails but we have localStorage data, use that
          if (parsedSellerInfo) {
            initializeFormData(parsedSellerInfo);
          } else {
            toast.error("Could not retrieve seller information.");
          }
        }
      } catch (error) {
        console.error("API Error fetching seller profile:", error);
        toast.error("Error fetching profile data from server. Using cached data.");
        
        // If API request fails but we have localStorage data, use that
        if (parsedSellerInfo) {
          initializeFormData(parsedSellerInfo);
        }
      }
    } catch (error) {
      console.error("Error in fetchSellerProfile:", error);
      toast.error("Something went wrong. Please try again later.");
      navigate('/seller-login');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to initialize form data from seller info
  const initializeFormData = (sellerData) => {
    setFormData({
      name: sellerData.name || '',
      email: sellerData.email || '',
      phone: sellerData.phone || '',
      address: sellerData.address || '',
      businessName: sellerData.businessName || '',
      bio: sellerData.bio || '',
      website: sellerData.website || '',
      city: sellerData.city || sellerData.address?.city || '',
      state: sellerData.state || sellerData.address?.state || '',
      zipCode: sellerData.zipCode || sellerData.address?.postalCode || '',
      country: sellerData.country || sellerData.address?.country || '',
      businessType: sellerData.businessType || '',
      taxId: sellerData.taxId || ''
    });
  };

  useEffect(() => {
    fetchSellerProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Form validation
      const requiredFields = ['name', 'email', 'phone', 'businessName'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        const fieldNames = missingFields.map(field => {
          const formattedField = field
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
          return formattedField;
        });
        
        toast.error(`Please fill in the following required fields: ${fieldNames.join(', ')}`);
        setIsSaving(false);
        return;
      }
      
      // Get seller token
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        navigate('/seller-login');
        return;
      }
      
      const sellerId = sellerInfo._id || sellerInfo.id;
      
      // Prepare the address object for API
      const formattedData = {
        ...formData,
        address: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zipCode,
          country: formData.country
        }
      };
      
      console.log("Sending update to API:", formattedData);
      
      // Try to update via API
      try {
        const response = await axios.put(
          `http://localhost:8000/api/seller-auth/${sellerId}`,
          formattedData,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data && response.data.seller) {
          const updatedSellerInfo = response.data.seller;
          
          // Update state and localStorage
          setSellerInfo(updatedSellerInfo);
          localStorage.setItem('sellerInfo', JSON.stringify(updatedSellerInfo));
          
          toast.success("Profile updated successfully!");
        } else {
          console.warn("API returned empty or invalid data after update");
          
          // Fallback: Update localStorage anyway
          const updatedSellerInfo = {
            ...sellerInfo,
            ...formData,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postalCode: formData.zipCode,
              country: formData.country
            }
          };
          
          setSellerInfo(updatedSellerInfo);
          localStorage.setItem('sellerInfo', JSON.stringify(updatedSellerInfo));
          
          toast.success("Profile updated in local storage.");
        }
      } catch (apiError) {
        console.error("API Error updating profile:", apiError);
        
        // Fallback: Update localStorage if API fails
        const updatedSellerInfo = {
          ...sellerInfo,
          ...formData
        };
        
        setSellerInfo(updatedSellerInfo);
        localStorage.setItem('sellerInfo', JSON.stringify(updatedSellerInfo));
        
        toast.warning("Couldn't update server, but saved changes locally.");
      }
      
      setEditMode(false);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values from sellerInfo
    initializeFormData(sellerInfo);
    setEditMode(false);
  };

  const handleRefresh = () => {
    fetchSellerProfile();
    toast.info("Refreshing profile data...");
  };

  if (loading && !sellerInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-lg text-gray-700">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-400 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Seller Profile</h1>
            <p className="text-white text-opacity-80 text-sm mt-1">
              Manage your seller information and business details
            </p>
          </div>
          
          <div className="flex space-x-2">
            {!editMode ? (
              <>
                <button 
                  onClick={handleRefresh} 
                  className="flex items-center bg-white bg-opacity-20 text-white px-3 py-2 rounded-md shadow-sm hover:bg-opacity-30 transition"
                >
                  <FiRefreshCw className="mr-1" /> Refresh
                </button>
                <button 
                  onClick={() => setEditMode(true)} 
                  className="flex items-center bg-white text-purple-600 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 transition"
                >
                  <FiEdit className="mr-2" /> Edit Profile
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleCancel} 
                  className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 transition"
                  disabled={isSaving}
                >
                  <FiX className="mr-2" /> Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className={`flex items-center ${isSaving ? 'bg-purple-600' : 'bg-purple-700 hover:bg-purple-800'} text-white px-4 py-2 rounded-md shadow-sm transition`}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span> 
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-6xl font-light mb-4 shadow-md">
              {(sellerInfo.name?.charAt(0) || sellerInfo.businessName?.charAt(0) || 'S').toUpperCase()}
            </div>
            
            <h2 className="text-xl font-semibold text-center">
              {editMode ? 
                <input 
                  type="text" 
                  name="businessName" 
                  value={formData.businessName} 
                  onChange={handleChange}
                  className="text-center border-b border-gray-300 focus:border-purple-500 px-2 py-1 w-full"
                  placeholder="Business Name"
                /> : 
                formData.businessName || 'Your Business'
              }
            </h2>
            
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <FiCalendar className="mr-1" /> Seller since {sellerInfo.createdAt 
                ? new Date(sellerInfo.createdAt).getFullYear() 
                : new Date().getFullYear()
              }
            </div>
            
            {!editMode && (
              <div className="mt-6 space-y-2 w-full px-4">
                <div className="text-center py-2 px-4 bg-purple-50 rounded-lg text-purple-700 flex items-center justify-center">
                  <FiShoppingBag className="mr-2" />
                  {sellerInfo.totalProducts || 0} Products
                </div>
                <div className="text-center py-2 px-4 bg-green-50 rounded-lg text-green-700 flex items-center justify-center">
                  <FiDollarSign className="mr-2" />
                  {sellerInfo.totalSales || 0} Sales
                </div>
              </div>
            )}
            
            {editMode && (
              <div className="mt-4 w-full px-4 space-y-4">
                <div className="profile-field">
                  <label className="text-sm text-gray-600 flex items-center">
                    <FiGlobe className="mr-2" /> Website
                  </label>
                  <input 
                    type="text" 
                    name="website" 
                    value={formData.website} 
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Your Website URL"
                  />
                </div>
                
                <div className="profile-field">
                  <label className="text-sm text-gray-600 flex items-center">
                    <FiShoppingBag className="mr-2" /> Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value="">Select Type</option>
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                    <option value="partnership">Partnership</option>
                    <option value="nonprofit">Non-Profit</option>
                  </select>
                </div>
                
                <div className="profile-field">
                  <label className="text-sm text-gray-600 flex items-center">
                    <FiDollarSign className="mr-2" /> Tax ID/VAT
                  </label>
                  <input 
                    type="text" 
                    name="taxId" 
                    value={formData.taxId} 
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="For business purposes"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-2/3 md:pl-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="profile-field">
                <label className="text-sm text-gray-600 flex items-center">
                  <FiUser className="mr-2" /> Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                {editMode ? (
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Your Full Name"
                    required
                  />
                ) : (
                  <div className="mt-1 text-gray-800">{formData.name || 'Not provided'}</div>
                )}
              </div>
              
              <div className="profile-field">
                <label className="text-sm text-gray-600 flex items-center">
                  <FiMail className="mr-2" /> Email Address <span className="text-red-500 ml-1">*</span>
                </label>
                {editMode ? (
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Your Email"
                    required
                  />
                ) : (
                  <div className="mt-1 text-gray-800">{formData.email || 'Not provided'}</div>
                )}
              </div>
              
              <div className="profile-field">
                <label className="text-sm text-gray-600 flex items-center">
                  <FiPhone className="mr-2" /> Phone Number <span className="text-red-500 ml-1">*</span>
                </label>
                {editMode ? (
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Your Phone Number"
                    required
                  />
                ) : (
                  <div className="mt-1 text-gray-800">{formData.phone || 'Not provided'}</div>
                )}
              </div>
              
              {/* Address Fields */}
              <div className={editMode ? "border-t border-gray-200 pt-4" : ""}>
                <h3 className="font-medium text-gray-900 mb-2">Address Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="profile-field">
                    <label className="text-sm text-gray-600 flex items-center">
                      <FiMapPin className="mr-2" /> Street Address
                    </label>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Street Address"
                      />
                    ) : (
                      <div className="mt-1 text-gray-800">{formData.address || 'Not provided'}</div>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label className="text-sm text-gray-600">City</label>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="City"
                      />
                    ) : (
                      <div className="mt-1 text-gray-800">{formData.city || 'Not provided'}</div>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label className="text-sm text-gray-600">State/Province</label>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="State/Province"
                      />
                    ) : (
                      <div className="mt-1 text-gray-800">{formData.state || 'Not provided'}</div>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label className="text-sm text-gray-600">ZIP/Postal Code</label>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="zipCode" 
                        value={formData.zipCode} 
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="ZIP/Postal Code"
                      />
                    ) : (
                      <div className="mt-1 text-gray-800">{formData.zipCode || 'Not provided'}</div>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label className="text-sm text-gray-600">Country</label>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="country" 
                        value={formData.country} 
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Country"
                      />
                    ) : (
                      <div className="mt-1 text-gray-800">{formData.country || 'Not provided'}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="profile-field">
                <label className="text-sm text-gray-600 flex items-center">
                  <FiHelpCircle className="mr-2" /> Bio / About Your Business
                </label>
                {editMode ? (
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md" 
                    rows="4"
                    placeholder="Tell customers about your business, products, and expertise"
                  />
                ) : (
                  <div className="mt-1 text-gray-800 whitespace-pre-line">{formData.bio || 'No bio provided'}</div>
                )}
              </div>
            </div>
            
            {!editMode && (
              <div className="mt-6 text-sm text-gray-500 flex items-center">
                <FiHelpCircle className="mr-2" /> 
                Click "Edit Profile" to update your information
              </div>
            )}
          </div>
        </div>
      </div>
      
      {editMode && (
        <div className="bg-gray-50 px-6 py-3 flex justify-end border-t border-gray-200">
          <div className="text-sm text-gray-500 mr-auto flex items-center">
            <span className="text-red-500 mr-1">*</span> Required fields
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleCancel} 
              className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 border border-gray-300 transition"
              disabled={isSaving}
            >
              <FiX className="mr-2" /> Cancel
            </button>
            <button 
              onClick={handleSave} 
              className={`flex items-center ${isSaving ? 'bg-purple-600' : 'bg-purple-700 hover:bg-purple-800'} text-white px-4 py-2 rounded-md shadow-sm transition`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span> 
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile; 