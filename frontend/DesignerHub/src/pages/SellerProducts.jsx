import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellerProducts = ({ products }) => {
  const navigate = useNavigate();
  return (
    <div className="seller-products-root">
      <h2>Products</h2>
      <button onClick={() => navigate('/add-product')}>Add Product</button>
      {products && products.length > 0 ? (
        <table className="seller-products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{(p.imagePreview || p.imageUrl) && <img src={p.imagePreview || p.imageUrl} alt={p.name} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px'}} />}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No products yet.</div>
      )}
    </div>
  );
};

export default SellerProducts; 