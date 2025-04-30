import React from "react";
import "./Home.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const modelImages = [
  { src: "/src/assets/model1.jpg", alt: "Model 1", className: "home-model-img home-model-img-side" },
  { src: "/src/assets/model2.jpg", alt: "Model 2", className: "home-model-img home-model-img-mid" },
  { src: "/src/assets/model3.jpg", alt: "Model 3", className: "home-model-img home-model-img-center" },
  { src: "/src/assets/model4.jpg", alt: "Model 4", className: "home-model-img home-model-img-mid" },
  { src: "/src/assets/model5.jpg", alt: "Model 5", className: "home-model-img home-model-img-side" },
];

const summerProducts = [
  { src: "/src/assets/summer1.jpg", alt: "Summer Product 1" },
  { src: "/src/assets/summer2.jpg", alt: "Summer Product 2" },
];

const collectionImages = [
  { src: "/src/assets/col1.jpg", alt: "Dresses Collections", label: "DRESSES COLLECTIONS", link: "/collections/dresses" },
  { src: "/src/assets/col2.jpg", alt: "Tops Collections", label: "TOPS COLLECTIONS", link: "/shop?category=tops" },
  { src: "/src/assets/col3.jpg", alt: "Sweatshirt Collections", label: "SWEATSHIRT COLLECTIONS", link: "/shop?category=sweatshirts" },
  { src: "/src/assets/col4.jpg", alt: "Jackets Collections", label: "JACKETS COLLECTIONS", center: true, link: "/collections/jackets" },
  { src: "/src/assets/col5.jpg", alt: "Outwear Collection", label: "OUTWEAR COLLECTION", link: "/shop?category=outwear" },
];

const brands = [
  { src: "/src/assets/brand-levis.png", alt: "Levis" },
  { src: "/src/assets/brand-zara.png", alt: "Zara" },
  { src: "/src/assets/brand-gucci.png", alt: "Gucci" },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCollectionClick = (link) => {
    navigate(link);
  };

  const handleShopNowClick = () => {
    navigate('/shop');
  };

  return (
    <div className="home-root">
      {/* Banner */}
      <div className="home-banner">
        <img src="/src/assets/banner-model.jpg" alt="Banner Model" className="home-banner-img" />
        <div className="home-banner-text">
          <span>
            D E S I G N E R<br />W O R L D
          </span>
          <button className="home-banner-btn" onClick={handleShopNowClick}>SHOP NOW</button>
        </div>
      </div>
      {/* Quote */}
      <div className="home-quote">"Where Style Meets Innovation – Discover, Shop, and Shine with DesignerHub."</div>
      {/* Model Row */}
      <div className="home-model-row">
        {modelImages.map((img, i) => (
          <img key={i} src={img.src} alt={img.alt} className={img.className} />
        ))}
      </div>
      {/* Summer Product Section */}
      <div className="home-product-section">
        <h2 className="home-section-title">OUR NEW PRODUCT FOR THIS UPCOMING SUMMER 2025</h2>
        <div className="home-product-row">
          {summerProducts.map((img, i) => (
            <img key={i} src={img.src} alt={img.alt} className="home-product-img" />
          ))}
        </div>
      </div>
      {/* Collection Section */}
      <div className="home-collection-section">
        <h2 className="home-section-title">CHOOSE OUR COLLECTIONS TO MAKE YOURSELF LOOK ELEGANT</h2>
        <div className="home-collection-grid">
          {collectionImages.map((collection, i) => (
            <div 
              key={i} 
              className={`home-collection-item ${collection.center ? 'home-collection-center' : ''}`}
              onClick={() => handleCollectionClick(collection.link)}
              style={{ cursor: 'pointer' }}
            >
              <img src={collection.src} alt={collection.alt} className="home-collection-img" />
              <div className="home-collection-label">{collection.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Supported By */}
      <div className="home-supported">
        <h2 className="home-section-title">WE ARE SUPPORTED BY</h2>
        <div className="home-supported-row">
          {brands.map((brand, i) => (
            <div key={i} className="home-supported-box">
              <img src={brand.src} alt={brand.alt} className="home-supported-img" />
            </div>
          ))}
        </div>
      </div>
      {/* Start Selling Section */}
      <div className="home-sell-section">
        <div className="home-sell-title">
          START YOUR OWN <b>SELLING JOURNEY</b> WITH US !
        </div>
        <NavLink to="/seller-login" className="home-sell-btn">START NOW</NavLink>
      </div>
      {/* About Us */}
      <div className="home-about">
        <div className="home-about-bg">
          <span className="home-about-title">ABOUT US</span>
          <div className="home-about-content">
            <img src="/src/assets/about-model.jpg" alt="About Us Model" className="home-about-img" />
            <div className="home-about-text">
              <p>We are passionate about fashion and dedicated to bringing you the best in style, quality, and innovation. Our mission is to empower you to express yourself through clothing that makes you feel confident and unique.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
