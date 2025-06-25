import React, { useEffect, useState } from "react";
import "./Home.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import QuickView from "../components/QuickView";
import axios from "axios";

const modelImages = [
  { src: "/assets/model1.jpg", alt: "Model 1", className: "home-model-img home-model-img-side" },
  { src: "/assets/model2.jpg", alt: "Model 2", className: "home-model-img home-model-img-mid" },
  { src: "/assets/model3.jpg", alt: "Model 3", className: "home-model-img home-model-img-center" },
  { src: "/assets/model4.jpg", alt: "Model 4", className: "home-model-img home-model-img-mid" },
  { src: "/assets/model5.jpg", alt: "Model 5", className: "home-model-img home-model-img-side" },
];

const summerProducts = [
  { src: "/assets/summer1.jpg", alt: "Summer Product 1" },
  { src: "/assets/summer2.jpg", alt: "Summer Product 2" },
];

const collectionImages = [
  { src: "/assets/col1.jpg", alt: "Dresses Collections", label: "DRESSES COLLECTIONS", link: "/collections/dresses" },
  { src: "/assets/col2.jpg", alt: "Tops Collections", label: "TOPS COLLECTIONS", link: "/shop?category=tops" },
  { src: "/assets/col3.jpg", alt: "Sweatshirt Collections", label: "SWEATSHIRT COLLECTIONS", link: "/shop?category=sweatshirts" },
  { src: "/assets/col4.jpg", alt: "Jackets Collections", label: "JACKETS COLLECTIONS", link: "/collections/jackets" },
  { src: "/assets/col5.jpg", alt: "Outwear Collection", label: "OUTWEAR COLLECTION", link: "/shop?category=outwear" },
];

const brands = [
  { src: "/assets/brand-levis.png", alt: "Levis" },
  { src: "/assets/brand-zara.png", alt: "Zara" },
  { src: "/assets/brand-gucci.png", alt: "Gucci" },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        if (response.data) {
          // Shuffle products for a dynamic "New Arrivals" section on each visit
          const shuffled = response.data.sort(() => 0.5 - Math.random());
          setProducts(shuffled);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleCollectionClick = (link) => {
    navigate(link);
  };

  const handleShopNowClick = () => {
    navigate('/shop');
  };

  const categories = [
    {
      title: "Streetwear",
      image: "/assets/streetwear.jpg",
      link: "/shop?category=streetwear"
    },
    {
      title: "Activewear",
      image: "/assets/activewear.jpg",
      link: "/shop?category=activewear"
    },
    {
      title: "Casual",
      image: "/assets/casual.jpg",
      link: "/shop?category=casual"
    }
  ];

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="hero-video">
            <source src="/assets/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <motion.div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          <div className="hero-floating-shapes"></div>
        </div>

        <motion.div 
          className="relative z-10 text-center text-white hero-content"
          style={{ y: textY }}
        >
          <motion.h1 
            className="hero-title text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="gradient-text">DESIGNER</span>
            <span className="glassmorphism neon-glow hero-hub ml-3">HUB</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle text-xl md:text-2xl mb-8 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Elevate Your Style. Define Your Future.
          </motion.p>
          <motion.button
            className="hero-btn px-8 py-3 bg-purple-600 text-white rounded-full text-lg font-medium hover:bg-purple-700 transition-colors duration-300 ripple-btn"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(139, 92, 246, 0.7)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            onClick={handleShopNowClick}
          >
            Explore Collection
          </motion.button>
        </motion.div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div
            className="w-8 h-12 rounded-full border-2 border-white flex items-start justify-center p-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-white rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        className="py-20 px-4 curve-bottom relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #0f0f0f, #1a1a1a, #0f0f0f)",
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)"
        }}
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 backdrop-filter backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
        </div>
        
        {/* Decorative particle elements */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 100}, ${Math.random() * 155 + 100}, ${Math.random() * 0.4 + 0.2})`,
              }}
              animate={{
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40,
                scale: [1, 1.2, 1],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-20 max-w-7xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold mb-4 text-white"
            variants={fadeInUp}
          >
            Explore by <span className="gradient-text">Category</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Find your perfect look from our curated collections, designed for every style and occasion.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="relative rounded-lg overflow-hidden group category-card"
                variants={fadeInUp}
                onClick={() => handleCollectionClick(category.link)}
              >
                <img src={category.image} alt={category.title} className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold uppercase tracking-widest">{category.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              <span className="gradient-text">New</span> Arrivals
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Check out the latest drops from top brands, curated just for you.
            </p>
          </motion.div>
          
          {loading && (
            <div className="text-center">Loading products...</div>
          )}

          {error && (
            <div className="text-center text-red-500">Error: {error}</div>
          )}

          {!loading && !error && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {products.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product._id || index}
                  className="product-card-container"
                  variants={fadeInUp}
                >
                  <div className="relative overflow-hidden rounded-lg group product-card h-full">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0].url : "https://picsum.photos/300"}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full flex-col items-start justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        onClick={() => handleQuickView(product)}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-sm text-gray-300">{product.name}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-16 text-center">
            <button 
              className="shop-all-btn"
              onClick={handleShopNowClick}
            >
              <span>Shop All New Arrivals</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <motion.section 
        className="py-20 px-4 bg-purple-900 text-white curve-top animated-bg"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8 relative"
            variants={fadeInUp}
          >
            Join the Movement
            <motion.span 
              className="absolute -top-6 -right-6 text-5xl text-yellow-300 opacity-50"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.2, 1, 1.2, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              ✨
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl mb-12"
            variants={fadeInUp}
          >
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </motion.p>
          <motion.form 
            className="flex flex-col md:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <motion.div className="relative flex-1 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(255, 255, 255, 0)", "0 0 0 10px rgba(255, 255, 255, 0)"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-purple-900 rounded-full font-medium hover:bg-purple-100 transition-colors duration-300 neon-glow"
            >
              Subscribe
            </motion.button>
          </motion.form>
        </div>
        
        {/* Floating elements in background */}
        <motion.div className="absolute top-10 left-10 w-20 h-20 bg-purple-600 rounded-full opacity-20 blur-xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
        <motion.div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        />
        <motion.div className="absolute top-40 right-20 w-16 h-16 bg-pink-400 rounded-full opacity-20 blur-xl"
          animate={{ y: [0, 50, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
      </motion.section>

      {/* Model Row */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 p-8"
      >
        {modelImages.map((img, i) => (
          <motion.img 
            key={i} 
            src={img.src} 
            alt={img.alt} 
            className="w-64 h-96 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </motion.div>

      {/* Summer Product Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 bg-white"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
          OUR NEW PRODUCT FOR THIS UPCOMING SUMMER 2025
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {summerProducts.map((img, i) => (
            <motion.img 
              key={i} 
              src={img.src} 
              alt={img.alt} 
              className="w-full max-w-md rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Collection Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 bg-gray-50"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 section-title">
          CHOOSE OUR COLLECTIONS TO MAKE YOURSELF LOOK ELEGANT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {collectionImages.map((collection, i) => (
            <motion.div 
              key={i} 
              className="relative group cursor-pointer"
              onClick={() => handleCollectionClick(collection.link)}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 zoom-on-hover">
                <img 
                  src={collection.src} 
                  alt={collection.alt} 
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <motion.div 
                  className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 rounded-lg flex items-center justify-center overflow-hidden"
                  whileHover={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.5)"
                  }}
                >
                  <motion.span 
                    className="text-white text-xl font-semibold tracking-wider text-center px-4 py-2 border-b border-t border-white/30"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      paddingLeft: "2rem",
                      paddingRight: "2rem"
                    }}
                  >
                    {collection.label}
                  </motion.span>
                </motion.div>
              </div>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-6 bg-black/20 blur-md rounded-full"
                initial={{ opacity: 0.2, width: "60%" }}
                whileHover={{ opacity: 0.4, width: "70%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Supported By */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 bg-white"
      >
        <div className="relative mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800">
            WE ARE SUPPORTED BY
          </h2>
          <div className="w-full max-w-xl mx-auto h-0.5 bg-purple-500 mt-2 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-white"></div>
          </div>
        </div>
        <div className="flex justify-center items-center max-w-4xl mx-auto mt-6">
          <div className="grid grid-cols-3 gap-x-16 gap-y-8 mt-6 px-8">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                className="relative p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <motion.img 
                  src={brand.src} 
                  alt={brand.alt} 
                  className="h-10 grayscale hover:grayscale-0 transition-all duration-500"
                  whileHover={{ filter: "grayscale(0)" }}
                />
                <motion.div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-purple-500 scale-0"
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Start Selling Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center relative overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="rgba(255,255,255,0.05)" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="absolute bottom-0 left-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="rgba(255,255,255,0.05)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,202.7C1248,213,1344,171,1392,149.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </motion.div>
        
        <motion.div className="relative z-10">
          <motion.div 
            className="text-3xl md:text-4xl font-bold mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            START YOUR OWN <span className="text-yellow-300 highlight-text">SELLING JOURNEY</span> WITH US !
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <NavLink 
              to="/seller-login" 
              className="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 neon-glow ripple-btn"
            >
              START NOW
            </NavLink>
          </motion.div>
        </motion.div>
        
        {/* Floating elements in background */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white opacity-10 blur-lg"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-yellow-300 opacity-10 blur-lg"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        />
      </motion.div>

      {/* About Us */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.span 
            className="block text-3xl font-bold text-center mb-12 text-gray-800"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            ABOUT US
          </motion.span>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.img 
              src="/assets/about-model.jpg" 
              alt="About Us Model" 
              className="w-full md:w-1/2 rounded-lg shadow-lg"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            />
            <motion.div 
              className="w-full md:w-1/2 text-gray-700 text-lg leading-relaxed"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p>
                We are passionate about fashion and dedicated to bringing you the best in style, quality, and innovation. 
                Our mission is to empower you to express yourself through clothing that makes you feel confident and unique.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      {isQuickViewOpen && selectedProduct && (
        <QuickView
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
