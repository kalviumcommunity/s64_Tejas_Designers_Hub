import React, { useEffect, useState } from "react";
import "./Home.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import QuickView from "../components/QuickView";

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
  const { scrollYProgress } = useScroll();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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
      image: "/src/assets/streetwear.jpg",
      link: "/shop?category=streetwear"
    },
    {
      title: "Activewear",
      image: "/src/assets/activewear.jpg",
      link: "/shop?category=activewear"
    },
    {
      title: "Casual",
      image: "/src/assets/casual.jpg",
      link: "/shop?category=casual"
    }
  ];

  const products = [
    {
      id: 1,
      name: "ASRV x Equinox Lycra",
      price: "USD 116.00",
      image: "/src/assets/product1.jpg",
      category: "Winter"
    },
    {
      id: 2,
      name: "ASRV x Equinox Lycra",
      price: "USD 116.00",
      image: "/src/assets/product2.jpg",
      category: "Winter"
    },
    {
      id: 3,
      name: "ASRV x Equinox Lycra",
      price: "USD 116.00",
      image: "/src/assets/product3.jpg",
      category: "Winter"
    },
    {
      id: 4,
      name: "ASRV x Equinox Lycra",
      price: "USD 116.00",
      image: "/src/assets/product4.jpg",
      category: "Winter"
    },
    {
      id: 5,
      name: "ASRV x Equinox Lycra",
      price: "USD 116.00",
      image: "/src/assets/product5.jpg",
      category: "Winter"
    },
    {
      id: 6,
      name: "ASRV x Equinox Lycra",
      price: "USD 116.00",
      image: "/src/assets/product6.jpg",
      category: "Winter"
    },
    {
      id: 7,
      name: "ASRV x Equinox Lycra",
      price: "USD 116.00",
      image: "/src/assets/product7.jpg",
      category: "Winter"
    },
    {
      id: 8,
      name: "ASRV x Equinox Lycra",
      price: "USD 116.00",
      image: "/src/assets/product8.jpg",
      category: "Winter"
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
          <motion.img
            src="/src/assets/banner-model.jpg"
            alt="Hero"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
          />
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
                y: [0, Math.random() * -50 - 20, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, Math.random() * 0.5 + 0.3, 0],
                scale: [0, Math.random() * 1 + 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <motion.div 
          className="absolute top-0 left-0 w-40 h-40 bg-purple-600 rounded-full opacity-20 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-10 w-56 h-56 bg-indigo-700 rounded-full opacity-20 blur-xl"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.15, 0.2],
            y: [0, -20, 0],
            x: [0, -15, 0]
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 0.5
          }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-28 h-28 bg-pink-600 rounded-full opacity-15 blur-xl"
          animate={{ 
            y: [0, -25, 0], 
            x: [0, 15, 0],
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-20 h-20 opacity-30"
          style={{ 
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)" 
          }}
          animate={{ 
            scale: [1, 1.5, 1], 
            opacity: [0.3, 0.15, 0.3],
            y: [0, 30, 0],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 1.5
          }}
        />
        
        <motion.h2 
          className="text-4xl md:text-6xl text-center mb-20 text-white relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="bold-title block" 
            data-text="DISCOVER YOUR STYLE"
            initial={{ letterSpacing: "0.01em" }}
            whileInView={{ letterSpacing: "0.08em" }}
            transition={{ 
              duration: 1.2, 
              ease: [0.215, 0.61, 0.355, 1],
              delay: 0.2 
            }}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              DISCOVER
            </motion.span>{" "}
            <motion.span 
              className="text-accent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              YOUR
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
            >
              STYLE
            </motion.span>
            <motion.div
              className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100%", opacity: 1 }}
              transition={{ 
                delay: 1.3, 
                duration: 1,
                ease: [0.215, 0.61, 0.355, 1]
              }}
            />
            <motion.div
              className="absolute -bottom-4 left-0 w-full h-2"
              style={{ 
                backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                backgroundSize: "200% 100%"
              }}
              initial={{ x: "-100%" }}
              whileInView={{ x: "100%" }}
              transition={{ 
                delay: 2.3, 
                duration: 1.5,
                ease: "easeInOut" 
              }}
            />
          </motion.span>
        </motion.h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }
              }}
              whileHover={{ 
                y: -15,
                transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
              }}
              viewport={{ once: true }}
              onClick={() => navigate(category.link)}
            >
              <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-indigo-900/30 z-10 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                  whileHover={{ 
                    scale: 1.12,
                    transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] } 
                  }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 0.9 }}
                  transition={{ duration: 0.6 }}
                />
                
                <motion.div
                  className="absolute inset-0 z-20 flex flex-col justify-end p-6"
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-3"
                    initial={{ y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.5 }}
                  >
                    {category.title}
                  </motion.h3>
                  
                  <motion.div
                    className="overflow-hidden h-8"
                    initial={{ height: 0 }}
                    whileHover={{ height: "auto" }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <motion.p 
                      className="text-gray-200 flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      Explore Collection 
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.8 }}
                      >
                        →
                      </motion.span>
                    </motion.p>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="absolute inset-0 border-2 border-purple-300/0 rounded-xl z-20"
                  initial={{ borderColor: "rgba(216, 180, 254, 0)" }}
                  whileHover={{ 
                    borderColor: "rgba(216, 180, 254, 0.3)",
                    borderWidth: "3px",
                    boxShadow: "inset 0 0 20px rgba(139, 92, 246, 0.3)"
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <motion.div
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-[85%] h-10 bg-black/20 blur-md rounded-full"
                initial={{ opacity: 0.3, width: "60%" }}
                whileHover={{ opacity: 0.5, width: "95%" }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* New Arrivals */}
      <motion.section 
        className="py-20 px-4 bg-white relative"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="relative mb-20">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-800"
            variants={fadeInUp}
          >
            New Arrivals
          </motion.h2>
          <motion.div 
            className="w-full max-w-xl mx-auto h-0.5 bg-gray-300 relative"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            />
            <motion.div 
              className="absolute top-0 left-0 right-0 h-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)",
                backgroundSize: "200% 100%"
              }}
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 0%"]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mt-12"
          variants={staggerContainer}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="group relative bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
              whileHover={{ y: -8 }}
              onClick={() => handleQuickView(product)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {/* Product Image */}
              <div className="aspect-[3/4] overflow-hidden relative">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  layoutId={`product-image-${product.id}`}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Quick actions on hover */}
                <motion.div
                  className="absolute top-4 right-4 space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className="w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to wishlist
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              </div>

              {/* Product Info */}
              <motion.div className="p-4 bg-white">
                <div className="mb-1">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#8b5cf6", color: "#ffffff" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Bottom border accent */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Shadow overlay on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ 
                  opacity: 1,
                  boxShadow: "inset 0 0 20px rgba(139, 92, 246, 0.15), 0 10px 30px -10px rgba(0, 0, 0, 0.2)"
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

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
              className={`relative group cursor-pointer ${collection.center ? 'md:col-span-2 md:row-span-2' : ''}`}
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
              src="/src/assets/about-model.jpg" 
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
      <QuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
};

export default Home;
