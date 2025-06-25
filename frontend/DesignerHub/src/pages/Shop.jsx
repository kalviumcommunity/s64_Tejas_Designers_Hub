import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { FaSearch, FaTimes, FaShoppingCart, FaEye, FaFilter, FaHeart } from 'react-icons/fa';
import './Shop.css';

const Shop = () => {
  const { addToCart } = useCart();
  const { searchQuery, isSearching, handleSearch, clearSearch } = useSearch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const headerRef = useRef(null);

  useEffect(() => {
    // Initialize local search from context
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Add scroll animation for header
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (headerRef.current) {
        if (scrollPosition > 100) {
          headerRef.current.classList.add('scrolled');
        } else {
          headerRef.current.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        
        if (response.data) {
          setProducts(response.data);
          
          // Extract unique categories from products
          const uniqueCategories = [...new Set(response.data.map(product => product.category))];
          setCategories(uniqueCategories);
          
          console.log('Fetched products:', response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
        toast.error('Failed to load products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  const handleLocalSearch = (e) => {
    e.preventDefault();
    handleSearch(localSearchQuery);
  };

  const handleClearSearch = () => {
    clearSearch();
    setLocalSearchQuery('');
  };

  const toggleFavorite = (productId) => {
    let newFavorites;
    
    if (favorites.includes(productId)) {
      newFavorites = favorites.filter(id => id !== productId);
      toast.info('Removed from favorites');
    } else {
      newFavorites = [...favorites, productId];
      toast.success('Added to favorites');
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  const sortProducts = (products) => {
    switch (sortOption) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products; // featured or default sorting
    }
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    // First filter by category (if not "all")
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Then filter by search query (if exists)
    const matchesSearch = !isSearching || !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Sort the filtered products
  const sortedAndFilteredProducts = sortProducts(filteredProducts);

  const handleAddToCart = (product) => {
    // Add the selected product to cart with default size if multiple sizes available
    const productToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0].url : 'https://picsum.photos/300',
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '', 
      category: product.category,
      quantity: 1
    };
    
    addToCart(productToAdd);
    
    // Create a toast with animation
    toast.success(`Added ${product.name} to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: 'cart-toast-animation'
    });
  };

  if (loading) {
    return (
      <div className="shop-loading">
        <div className="shop-loading-spinner"></div>
        <p>Loading products...</p>
        <div className="loading-shimmers">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer-card">
              <div className="shimmer-image"></div>
              <div className="shimmer-title"></div>
              <div className="shimmer-price"></div>
              <div className="shimmer-desc"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header" ref={headerRef}>
        <h1>Designer Collections</h1>
        <p>Explore our curated selection of designer products</p>
      </div>

      {/* Local search form (shown only on shop page) */}
      <div className="shop-search-container">
        <form onSubmit={handleLocalSearch} className="shop-search-form">
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="Search products by name, description or category..."
            className="shop-search-input"
          />
          <button type="submit" className="shop-search-button">
            <FaSearch /> Search
          </button>
          {isSearching && searchQuery && (
            <button 
              type="button" 
              className="shop-clear-search" 
              onClick={handleClearSearch}
            >
              <FaTimes /> Clear
            </button>
          )}
        </form>
      </div>

      {/* Active search results display */}
      {isSearching && searchQuery && (
        <div className="search-active-container">
          <p className="search-results-label">
            Showing results for: <span className="search-query">"{searchQuery}"</span>
            <button 
              className="clear-search-small" 
              onClick={handleClearSearch}
            >
              <FaTimes />
            </button>
          </p>
        </div>
      )}

      <div className="shop-filters-container">
        <div className="filter-header">
          <button
            className="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div className="sort-options">
            <label>Sort by: </label>
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        
        <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
          <div className="category-filter">
            <button 
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shop-results-info">
        <p>
          Showing <span className="highlight">{sortedAndFilteredProducts.length}</span> 
          {selectedCategory !== 'all' && (
            <> items in <span className="highlight">{selectedCategory}</span></>
          )}
        </p>
      </div>

      {sortedAndFilteredProducts.length === 0 ? (
        <div className="no-products">
          {isSearching && searchQuery ? (
            <>
              <p>No products found matching "{searchQuery}".</p>
              <button 
                className="clear-search-button" 
                onClick={handleClearSearch}
              >
                Clear Search
              </button>
            </>
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {sortedAndFilteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <button 
                className={`favorite-btn ${favorites.includes(product._id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(product._id)}
                aria-label={favorites.includes(product._id) ? "Remove from favorites" : "Add to favorites"}
              >
                <FaHeart />
              </button>
              <div className="product-image-container">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0].url : "https://picsum.photos/400"}
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "https://picsum.photos/400";
                  }}
                  loading="lazy"
                />
                <div className="product-overlay">
                  <Link to={`/product/${product._id}`} className="quick-view-btn">
                    <FaEye /> View Details
                  </Link>
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-badge">
                  {product.isNew && <span className="badge new-badge">New</span>}
                  {product.onSale && <span className="badge sale-badge">Sale</span>}
                </div>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-category">{product.category}</p>
                <div className="product-sizes">
                  {product.sizes && product.sizes.map(size => (
                    <span key={size} className="product-size">{size}</span>
                  ))}
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-button-container">
                  <Link to={`/product/${product._id}`} className="product-btn view-details-btn">
                    <FaEye /> View Details
                  </Link>
                  <button 
                    className="product-btn add-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
