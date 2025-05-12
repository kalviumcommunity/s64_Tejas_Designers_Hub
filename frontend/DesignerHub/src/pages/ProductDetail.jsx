import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        
        if (response.data) {
          setProduct(response.data);
          // Set the main image to the first image
          if (response.data.images && response.data.images.length > 0) {
            setMainImage(response.data.images[0].url);
          }
          // Set default selected size if available
          if (response.data.sizes && response.data.sizes.length > 0) {
            setSelectedSize(response.data.sizes[0]);
          }
          console.log('Fetched product:', response.data);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product details');
        toast.error('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      toast.warning('Please select a size');
      return;
    }

    const productToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: mainImage || (product.images[0]?.url || 'https://via.placeholder.com/500'),
      size: selectedSize,
      category: product.category,
      quantity: quantity
    };

    addToCart(productToAdd);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Error Loading Product</h2>
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate('/shop')}>Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-breadcrumb">
        <span onClick={() => navigate('/shop')}>Shop</span>
        <span>&gt;</span>
        <span onClick={() => navigate(`/shop?category=${product.category}`)}>{product.category}</span>
        <span>&gt;</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={mainImage || (product.images[0]?.url || 'https://via.placeholder.com/500')} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500';
              }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${mainImage === image.url ? 'active' : ''}`}
                  onClick={() => handleImageClick(image.url)}
                >
                  <img 
                    src={image.url} 
                    alt={`${product.name} - view ${index + 1}`}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="product-sizes" style={{ border: 'none' }}>
              <span className="section-title" style={{ border: 'none' }}>Select Size</span>
              <div className="sizes-container" style={{ border: 'none' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => handleSizeSelect(size)}
                    style={{ outline: 'none', boxShadow: 'none' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-quantity" style={{ border: 'none' }}>
            <span className="section-title" style={{ border: 'none' }}>Quantity</span>
            <div className="quantity-selector" style={{ border: 'none' }}>
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                style={{ outline: 'none', boxShadow: 'none' }}
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= (product.stock || 10)}
                style={{ outline: 'none', boxShadow: 'none' }}
              >
                +
              </button>
            </div>
          </div>

          <button 
            className="add-to-cart-button" 
            onClick={handleAddToCart}
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            Add to Cart
          </button>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-delivery">
            <div className="delivery-item">
              <i className="icon">🚚</i>
              <span>Free shipping for orders over $100</span>
            </div>
            <div className="delivery-item">
              <i className="icon">↩️</i>
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 