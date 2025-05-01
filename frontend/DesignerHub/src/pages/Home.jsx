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
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>

        <motion.div 
          className="relative z-10 text-center text-white"
          style={{ y: textY }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            DESIGNER<span className="text-purple-400">HUB</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Elevate Your Style. Define Your Future.
          </motion.p>
          <motion.button
            className="px-8 py-3 bg-purple-600 text-white rounded-full text-lg font-medium hover:bg-purple-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            onClick={handleShopNowClick}
          >
            Explore Collection
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        className="py-20 px-4 bg-gray-900"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          variants={fadeInUp}
        >
          Discover Your Style
        </motion.h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              className="relative group cursor-pointer"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              onClick={() => navigate(category.link)}
            >
              <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore Collection →
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section 
        className="py-20 px-4 bg-white"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          variants={fadeInUp}
        >
          New Arrivals
        </motion.h2>
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={staggerContainer}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="group relative bg-white rounded-[20px] overflow-hidden cursor-pointer"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleQuickView(product)}
            >
              {/* Product Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  layoutId={`product-image-${product.id}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Product Info Overlay */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4"
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {product.category}
          </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-gray-600 hover:text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to wishlist logic here
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.price}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        className="py-20 px-4 bg-purple-900 text-white"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8"
            variants={fadeInUp}
          >
            Join the Movement
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
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-purple-900 rounded-full font-medium hover:bg-purple-100 transition-colors duration-300"
            >
              Subscribe
            </motion.button>
          </motion.form>
        </div>
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
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
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
              <img 
                src={collection.src} 
                alt={collection.alt} 
                className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-semibold tracking-wider text-center px-4">
                  {collection.label}
                </span>
            </div>
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
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
          WE ARE SUPPORTED BY
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 max-w-4xl mx-auto">
          {brands.map((brand, i) => (
            <motion.img 
              key={i} 
              src={brand.src} 
              alt={brand.alt} 
              className="h-12 grayscale hover:grayscale-0 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Start Selling Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center"
      >
        <motion.div 
          className="text-3xl md:text-4xl font-bold mb-8"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          START YOUR OWN <span className="text-yellow-300">SELLING JOURNEY</span> WITH US !
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink 
            to="/seller-login" 
            className="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            START NOW
          </NavLink>
        </motion.div>
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
