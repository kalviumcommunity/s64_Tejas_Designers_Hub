// import React from 'react';
// import { Link } from 'react-router-dom';
// import './LandingPage.css';

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 text-gray-800 font-sans">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center">
//             <Link to="/" className="text-3xl font-bold tracking-tight text-purple-900">
//               Designer<span className="text-pink-600">Hub</span>
//             </Link>
//           </div>
          
//           <div className="hidden md:flex space-x-8 text-gray-700">
//             <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
//             <a href="#categories" className="hover:text-pink-600 transition-colors">Shop</a>
//             <a href="#sellers" className="hover:text-pink-600 transition-colors">Sell</a>
//             <a href="#about" className="hover:text-pink-600 transition-colors">About</a>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button className="hidden md:block text-gray-700 hover:text-pink-600 transition-colors">
//               <i className="fas fa-search text-xl"></i>
//             </button>
//             <div className="relative">
//               <button className="text-gray-700 hover:text-pink-600 transition-colors">
//                 <i className="fas fa-shopping-cart text-xl"></i>
//                 <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
//               </button>
//             </div>
//             <Link to="/login" className="login-button">Login</Link>
//             <Link to="/signup" className="signup-button">Sign Up</Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="hero-section relative">
//         <div className="decorative-circle decorative-circle-1"></div>
//         <div className="decorative-circle decorative-circle-2"></div>
//         <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
//           <div className="md:w-1/2 text-center mb-10 md:mb-0">
//             <div className="badge">
//               <span>30-Day Roadmap</span>
//             </div>
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 leading-tight">
//               Elevate Your <span className="text-pink-600">Fashion</span> Journey
//             </h1>
//             <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-lg mx-auto">
//               Join the premier platform connecting fashion enthusiasts, designers, and boutiques in one seamless ecosystem.
//             </p>
//             <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
//               <button className="cta-button-primary">
//                 Shop Now
//               </button>
//               <button className="cta-button-secondary">
//                 Start Selling
//               </button>
//             </div>
//           </div>
//           <div className="md:w-1/2">
//             <div className="relative">
//               <div className="hero-image-container">
//                 <img 
//                   src="/src/assets/salwar-suit-royal-blue-designer-salwar-suit-with-palazzo-silk-saree-online-30214835503297_919a4e23-e0c4-4153-867f-15e1fe2b2098.jpg" 
//                   alt="Fashion Collection" 
//                   className="rounded-lg shadow-2xl object-cover"
//                 />
//                 <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 flex items-center">
//                   <div className="bg-green-500 rounded-full h-3 w-3 mr-2"></div>
//                   <span className="text-sm font-medium">AI-Powered Recommendations</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Explore Button Section */}
//       <section className="py-8 text-center">
//         <div className="container mx-auto px-4">
//           <a href="#categories" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
//             <span className="mr-2">Explore Collections</span>
//             <i className="fas fa-arrow-down animate-bounce"></i>
//           </a>
//         </div>
//       </section>

//       {/* Features Section - Customers */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="section-title">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">For Customers</h2>
//             <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
//               Experience fashion like never before with our customer-focused features
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <div className="feature-card">
//               <div className="feature-icon">
//                 <i className="fas fa-tshirt"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Curated Collections</h3>
//               <p className="text-gray-600 mt-2">
//                 Browse through handpicked designer collections tailored to your style preferences.
//               </p>
//             </div>
            
//             <div className="feature-card">
//               <div className="feature-icon">
//                 <i className="fas fa-heart"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Wishlist & Favorites</h3>
//               <p className="text-gray-600 mt-2">
//                 Save your favorite items for later and create personalized collections.
//               </p>
//             </div>
            
//             <div className="feature-card">
//               <div className="feature-icon">
//                 <i className="fas fa-credit-card"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Secure Checkout</h3>
//               <p className="text-gray-600 mt-2">
//                 Shop with confidence using our PayPal-secured payment system.
//               </p>
//             </div>
            
//             <div className="feature-card">
//               <div className="feature-icon">
//                 <i className="fas fa-truck"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Order Tracking</h3>
//               <p className="text-gray-600 mt-2">
//                 Track your orders in real-time from purchase to delivery.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section - Sellers */}
//       <section id="sellers" className="py-16 bg-purple-50">
//         <div className="container mx-auto px-4">
//           <div className="section-title">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">For Sellers</h2>
//             <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
//               Powerful tools to grow your fashion business and reach more customers
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="feature-card-alt">
//               <div className="feature-icon-alt">
//                 <i className="fas fa-store"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Inventory Management</h3>
//               <p className="text-gray-600 mt-2">
//                 Easily manage your product listings, stock levels, and variants from one dashboard.
//               </p>
//             </div>
            
//             <div className="feature-card-alt">
//               <div className="feature-icon-alt">
//                 <i className="fas fa-chart-line"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Sales Analytics</h3>
//               <p className="text-gray-600 mt-2">
//                 Get detailed insights into your sales performance, customer demographics, and trends.
//               </p>
//             </div>
            
//             <div className="feature-card-alt">
//               <div className="feature-icon-alt">
//                 <i className="fas fa-money-bill-wave"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Earnings Reports</h3>
//               <p className="text-gray-600 mt-2">
//                 Track your revenue, commissions, and payouts with comprehensive financial reports.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section - Admins */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="section-title">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">For Admins</h2>
//             <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
//               Powerful management tools to oversee the entire platform
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="feature-card">
//               <div className="feature-icon">
//                 <i className="fas fa-shield-alt"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Content Moderation</h3>
//               <p className="text-gray-600 mt-2">
//                 Ensure all content meets platform standards with our moderation tools.
//               </p>
//             </div>
            
//             <div className="feature-card">
//               <div className="feature-icon">
//                 <i className="fas fa-users"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">User Management</h3>
//               <p className="text-gray-600 mt-2">
//                 Manage user accounts, permissions, and access levels with ease.
//               </p>
//             </div>
            
//             <div className="feature-card">
//               <div className="feature-icon">
//                 <i className="fas fa-chart-pie"></i>
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Platform Analytics</h3>
//               <p className="text-gray-600 mt-2">
//                 Get comprehensive insights into platform performance and user behavior.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section id="categories" className="py-16 bg-pink-50">
//         <div className="container mx-auto px-4">
//           <div className="section-title">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop By Category</h2>
//             <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
//               Explore our wide range of fashion categories
//             </p>
//           </div>
          
//           <div className="flex justify-center gap-8 flex-wrap">
//             {/* Men */}
//             <div className="category-card">
//               <div className="category-image-container">
//                 <img
//                   src="/src/assets/tn_99.jpg"
//                   alt="Men's Fashion"
//                   className="category-image"
//                 />
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Men</h3>
//               <button className="shop-button mt-3 hover:scale-105 transition-transform">Shop Now</button>
//             </div>
            
//             {/* Women */}
//             <div className="category-card">
//               <div className="category-image-container">
//                 <img
//                   src="/src/assets/salwar-suit-royal-blue-designer-salwar-suit-with-palazzo-silk-saree-online-30214835503297_919a4e23-e0c4-4153-867f-15e1fe2b2098.jpg"
//                   alt="Women's Fashion"
//                   className="category-image"
//                 />
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Women</h3>
//               <button className="shop-button mt-3 hover:scale-105 transition-transform">Shop Now</button>
//             </div>
            
//             {/* Kids */}
//             <div className="category-card">
//               <div className="category-image-container">
//                 <img
//                   src="/src/assets/flower_girls_dresses.jpg"
//                   alt="Kids' Fashion"
//                   className="category-image"
//                 />
//               </div>
//               <h3 className="text-xl font-semibold mt-4">Kids</h3>
//               <button className="shop-button mt-3 hover:scale-105 transition-transform">Shop Now</button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="section-title">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Users Say</h2>
//             <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
//               Hear from our community of customers and sellers
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="testimonial-card">
//               <div className="testimonial-content">
//                 <p className="italic text-gray-600">
//                   "DesignerHub has transformed how I shop for fashion. The AI recommendations are spot-on, and I love the seamless checkout process!"
//                 </p>
//               </div>
//               <div className="testimonial-author mt-4">
//                 <div className="avatar">SJ</div>
//                 <div>
//                   <h4 className="font-semibold">Sarah Johnson</h4>
//                   <p className="text-sm text-gray-500">Fashion Enthusiast</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="testimonial-card">
//               <div className="testimonial-content">
//                 <p className="italic text-gray-600">
//                   "As a boutique owner, DesignerHub has helped me reach customers I never could before. The seller tools are intuitive and powerful."
//                 </p>
//               </div>
//               <div className="testimonial-author mt-4">
//                 <div className="avatar">MC</div>
//                 <div>
//                   <h4 className="font-semibold">Michael Chen</h4>
//                   <p className="text-sm text-gray-500">Boutique Owner</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="testimonial-card">
//               <div className="testimonial-content">
//                 <p className="italic text-gray-600">
//                   "The platform analytics have given us incredible insights into consumer behavior. It's been a game-changer for our fashion brand."
//                 </p>
//               </div>
//               <div className="testimonial-author mt-4">
//                 <div className="avatar">PP</div>
//                 <div>
//                   <h4 className="font-semibold">Priya Patel</h4>
//                   <p className="text-sm text-gray-500">Brand Manager</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Partner Logos */}
//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-8">
//             <h3 className="text-xl font-semibold text-gray-700">Trusted By Leading Brands</h3>
//           </div>
          
//           <div className="flex justify-center items-center flex-wrap gap-8 md:gap-16">
//             <div className="partner-logo">PayPal</div>
//             <div className="partner-logo">Stripe</div>
//             <div className="partner-logo">Fashion Week</div>
//             <div className="partner-logo">Vogue</div>
//             <div className="partner-logo">GQ</div>
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="cta-section">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Fashion Experience?</h2>
//           <p className="mt-4 text-lg max-w-2xl mx-auto">
//             Join thousands of fashion enthusiasts, designers, and boutiques on DesignerHub today.
//           </p>
//           <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <Link to="/signup" className="cta-button-white">
//               Create Account
//             </Link>
//             <button className="cta-button-outline">
//               Learn More
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer id="about" className="footer">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
//             <div>
//               <h3 className="text-xl font-bold">DesignerHub</h3>
//               <p className="mb-4">
//                 The premier platform for fashion enthusiasts, designers, and boutiques.
//               </p>
//               <p className="mb-4">
//                 Founded in 2023, DesignerHub aims to revolutionize the fashion industry by connecting designers directly with consumers, eliminating middlemen and creating a more sustainable fashion ecosystem.
//               </p>
//               <div className="footer-social justify-center md:justify-start">
//                 <a href="#"><i className="fab fa-facebook-f"></i></a>
//                 <a href="#"><i className="fab fa-twitter"></i></a>
//                 <a href="#"><i className="fab fa-instagram"></i></a>
//                 <a href="#"><i className="fab fa-pinterest"></i></a>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold">Quick Links</h3>
//               <ul className="footer-links">
//                 <li><Link to="/">Home</Link></li>
//                 <li><a href="#categories">Shop</a></li>
//                 <li><a href="#sellers">Sell</a></li>
//                 <li><a href="#about">About Us</a></li>
//                 <li><a href="#contact">Contact</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold">Legal</h3>
//               <ul className="footer-links">
//                 <li><a href="#">Terms of Service</a></li>
//                 <li><a href="#">Privacy Policy</a></li>
//                 <li><a href="#">Cookie Policy</a></li>
//                 <li><a href="#">Shipping Policy</a></li>
//                 <li><a href="#">Returns & Refunds</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold">Newsletter</h3>
//               <p className="mb-4">
//                 Subscribe to our newsletter for the latest updates and offers.
//               </p>
//               <div className="footer-newsletter-form">
//                 <input 
//                   type="email" 
//                   placeholder="Your email" 
//                   className="footer-newsletter-input"
//                 />
//                 <button className="footer-newsletter-button">
//                   Subscribe
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div id="contact" className="footer-bottom">
//             <p>&copy; {new Date().getFullYear()} DesignerHub. All rights reserved.</p>
//             <p className="mt-2">Contact us: <a href="mailto:info@designerhub.com" className="text-purple-300 hover:text-white">info@designerhub.com</a> | <a href="tel:+1234567890" className="text-purple-300 hover:text-white">+1 (234) 567-890</a></p>
//             <p className="mt-2">123 Fashion Street, Design District, New York, NY 10001</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;