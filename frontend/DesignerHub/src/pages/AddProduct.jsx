import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = ({ onAddProduct }) => {
  const [form, setForm] = useState({
    title: '',
    shortDesc: '',
    brief: '',
    price: '',
    discountPrice: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = e => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleSaveDraft = e => {
    e.preventDefault();
    // Optionally implement draft saving logic here
    alert('Draft saved! (not implemented)');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (onAddProduct) {
      onAddProduct({ ...form, id: Date.now(), imageFile, imagePreview });
    }
    navigate('/seller-products');
  };

  return (
    <div className="add-product-card">
      <div className="add-product-header">
        <span>Add New Product <span role="img" aria-label="love">😍</span></span>
        <button className="add-product-close" onClick={() => navigate(-1)}>×</button>
      </div>
      <form className="add-product-form-modern" onSubmit={handleSubmit}>
        <label className="add-product-label">Product Title</label>
        <input name="title" className="add-product-input" placeholder="Product Title" value={form.title} onChange={handleChange} required />
        <label className="add-product-label">Short Description</label>
        <input name="shortDesc" className="add-product-input" placeholder="Short Description" value={form.shortDesc} onChange={handleChange} required />
        <label className="add-product-label">Product Brief</label>
        <textarea name="brief" className="add-product-textarea" placeholder="Write your product brief..." value={form.brief} onChange={handleChange} required />
        <div className="add-product-row">
          <div className="add-product-price-box">
            <label className="add-product-label">Price</label>
            <div className="add-product-price-input">
              <span className="add-product-price-icon green">$</span>
              <input name="price" className="add-product-input" type="number" min="0" placeholder="0" value={form.price} onChange={handleChange} required />
              <span className="add-product-price-currency"></span>
            </div>
          </div>
          <div className="add-product-price-box">
            <label className="add-product-label">Discount Price</label>
            <div className="add-product-price-input">
              <span className="add-product-price-icon red">$</span>
              <input name="discountPrice" className="add-product-input" type="number" min="0" placeholder="0" value={form.discountPrice} onChange={handleChange} />
              <span className="add-product-price-currency"></span>
            </div>
          </div>
        </div>
        <div
          className={`add-product-dropzone${dragActive ? ' active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="add-product-image-preview" />
          ) : (
            <div className="add-product-dropzone-content">
              <span className="add-product-upload-icon">⬆️</span>
              <div>Drag & drop image to upload. 1200*800px size required in PNG or JPG format only.</div>
            </div>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageChange}
            required
          />
        </div>
        <div className="add-product-actions">
          <button className="add-product-btn draft" onClick={handleSaveDraft}>Save Draft</button>
          <button className="add-product-btn submit" type="submit">Add Product</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
