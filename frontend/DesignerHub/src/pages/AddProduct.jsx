import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddProduct.css';
import ImageUploader from '../components/ImageUploader';

const AddProduct = ({ onAddProduct }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men', // Default category
    sizes: [],
    images: [],
    stock: 1
  });
  const [loading, setLoading] = useState(false);

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const categoryOptions = ['Men', 'Women', 'Kids', 'Accessories'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSizeChange = (size) => {
    const newSizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size];

    setFormData({
      ...formData,
      sizes: newSizes
    });
  };

  const handleImagesUploaded = (imageData) => {
    console.log('Images uploaded successfully:', imageData);
    
    setFormData({
      ...formData,
      images: imageData
    });
    
    toast.success('Images uploaded successfully!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (formData.sizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for submission
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        sizes: formData.sizes,
        stock: parseInt(formData.stock) || 1,
        images: formData.images
      };
      
      console.log('Submitting product data:', productData);
      
      const token = localStorage.getItem('sellerToken');
      const response = await axios.post(
        'http://localhost:8000/api/products/json',
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Product created successfully:', response.data);

      // Call the onAddProduct prop if it exists
      if (onAddProduct) {
        onAddProduct(response.data);
      }

      toast.success('Product added successfully!');
      navigate('/seller-products');
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add product';
      console.error('Error details:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-header">
        <h1>Add New Product</h1>
        <p>List a new product in your store</p>
      </div>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="1"
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sizes</label>
          <div className="size-options">
            {sizeOptions.map((size) => (
              <motion.button
                type="button"
                key={size}
                className={`size-option ${formData.sizes.includes(size) ? 'selected' : ''}`}
                onClick={() => handleSizeChange(size)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <ImageUploader onImagesUploaded={handleImagesUploaded} />
        </div>

        <div className="preview-section">
          {formData.images.length > 0 && (
            <div className="images-preview">
              <h3>Uploaded Images:</h3>
              <div className="preview-grid">
                {formData.images.map((image, index) => (
                  <div key={index} className="preview-image">
                    <img 
                      src={typeof image === 'string' ? image : image.url} 
                      alt={`Product ${index + 1}`} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <motion.button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/seller-products')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="submit-btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
