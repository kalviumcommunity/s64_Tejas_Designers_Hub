// import React, { useState, useEffect } from 'react';
// import './DressesCollection.css';

// const DressesCollection = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("https://fakestoreapi.com/products/category/women's clothing");
//         if (!response.ok) {
//           throw new Error('Failed to fetch products');
//         }
//         const data = await response.json();
//         setProducts(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="dresses-loading">
//         <div className="dresses-loading-spinner"></div>
//         <p>Loading collection...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="dresses-error">
//         <p>Error: {error}</p>
//         <button onClick={() => window.location.reload()}>Try Again</button>
//       </div>
//     );
//   }

//   return (
//     <div className="dresses-container">
//       <div className="dresses-header">
//         <h1>Dresses Collections</h1>
//         <p>Discover our elegant selection of dresses for every occasion</p>
//       </div>
      
//       <div className="dresses-grid">
//         {products.map((product) => (
//           <div key={product.id} className="dress-card">
//             <div className="dress-image-container">
//               <img src={product.image} alt={product.title} className="dress-image" />
//               <div className="dress-overlay">
//                 <button className="quick-view-btn">Quick View</button>
//                 <button className="add-to-cart-btn">Add to Cart</button>
//               </div>
//             </div>
//             <div className="dress-info">
//               <h3 className="dress-title">{product.title}</h3>
//               <p className="dress-price">${product.price}</p>
//               <div className="dress-rating">
//                 <span className="stars">{'★'.repeat(Math.round(product.rating.rate))}</span>
//                 <span className="rating-count">({product.rating.count})</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DressesCollection;
