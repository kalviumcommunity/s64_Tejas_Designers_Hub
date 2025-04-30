import React, { useState, useEffect } from 'react';
import './JacketsCollection.css';

const JacketsCollection = () => {
  const [jackets, setJackets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJackets = async () => {
      try {
        // First, fetch all products from the mens-shirts and womens-dresses categories
        const [mensResponse, womensResponse] = await Promise.all([
          fetch('https://dummyjson.com/products/category/mens-shirts'),
          fetch('https://dummyjson.com/products/category/womens-dresses')
        ]);

        if (!mensResponse.ok || !womensResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const mensData = await mensResponse.json();
        const womensData = await womensResponse.json();

        // Combine and filter products that contain "jacket", "coat", or "blazer" in their title or description
        const allProducts = [...mensData.products, ...womensData.products];
        const jacketsData = allProducts.filter(item => {
          const searchText = (item.title + ' ' + item.description).toLowerCase();
          return searchText.includes('jacket') || 
                 searchText.includes('coat') || 
                 searchText.includes('blazer');
        });

        setJackets(jacketsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJackets();
  }, []);

  if (loading) {
    return (
      <div className="jackets-loading">
        <div className="jackets-loading-spinner"></div>
        <p>Loading jackets collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jackets-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="jackets-container">
      <div className="jackets-header">
        <h1>Jackets Collection</h1>
        <p>Discover our premium selection of jackets and outerwear</p>
      </div>

      <div className="jackets-grid">
        {jackets.map((jacket) => (
          <div key={jacket.id} className="jacket-card">
            <div className="jacket-image-container">
              <img src={jacket.thumbnail} alt={jacket.title} className="jacket-image" />
              <div className="jacket-overlay">
                <button className="quick-view-btn">Quick View</button>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
            <div className="jacket-info">
              <h3 className="jacket-title">{jacket.title}</h3>
              <p className="jacket-price">${jacket.price}</p>
              <p className="jacket-type">{jacket.category}</p>
              <p className="jacket-description">{jacket.description}</p>
              <div className="jacket-rating">
                <span className="stars">{'★'.repeat(Math.round(jacket.rating))}</span>
                <span className="rating-count">({jacket.stock} in stock)</span>
                <span className="discount">-{jacket.discountPercentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JacketsCollection; 