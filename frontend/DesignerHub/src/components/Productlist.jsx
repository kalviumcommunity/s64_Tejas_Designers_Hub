// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ProductList = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     axios.get('http://localhost:8000/api/products/user', {
//       headers: { 'Authorization': `Bearer ${token}` }
//     }).then((res) => setProducts(res.data));
//   }, []);

//   return (
//     <div>
//       {products.map(product => (
//         <div key={product._id}>
//           <h2>{product.name}</h2>
//           <img
//             src={`data:${product.image.contentType};base64,${btoa(
//               String.fromCharCode(...new Uint8Array(product.image.data.data))
//             )}`}
//             alt="Product"
//             style={{ width: '200px' }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProductList;
