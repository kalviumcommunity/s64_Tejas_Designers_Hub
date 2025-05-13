import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [],
    images: [],
    imageFiles: [],
    stock: '',
  });
  const [loading, setLoading] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('sellerToken');
        const res = await axios.get("http://localhost:8000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch seller products:", error);
        toast.error("Failed to load products. Please try again.");
      }
    };
  
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...previews],
      imageFiles: [...prev.imageFiles, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // First, validate the required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        toast.error('Please fill in all required fields (name, description, price, category)');
        setLoading(false);
        return;
      }

      if (formData.sizes.length === 0) {
        toast.error('Please select at least one size');
        setLoading(false);
        return;
      }

      if (!editProductId && formData.imageFiles.length === 0) {
        toast.error('Please add at least one product image');
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock || 1);
      
      // Handle sizes properly
      formData.sizes.forEach((size) => data.append('sizes[]', size));
      
      // Handle image files upload only if there are new images
      if (formData.imageFiles.length > 0) {
        formData.imageFiles.forEach((file) => data.append('images', file));
      }
  
      // Get authentication token from localStorage
      const token = localStorage.getItem('sellerToken');
      console.log('Using authentication token:', token ? 'Yes (token exists)' : 'No token');
      
      let response;
      if (editProductId) {
        // Update existing product
        response = await axios.patch(`http://localhost:8000/api/products/${editProductId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        });
        setProducts((prev) => prev.map((p) => p._id === editProductId ? response.data : p));
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        response = await axios.post("http://localhost:8000/api/products", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        });
        setProducts((prev) => [...prev, response.data]);
        toast.success("Product added successfully!");
      }
  
      console.log('Product operation successful:', response.data);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        sizes: [],
        images: [],
        imageFiles: [],
        stock: '',
      });
      setShowForm(false);
      setEditProductId(null);
    } catch (error) {
      console.error('Error with product operation:', error);
      const errorMessage = error.response?.data?.message || "Failed to perform operation. Please make sure you're logged in.";
      console.log('Error details:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('sellerToken');
      await axios.delete(`http://localhost:8000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete product.');
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      sizes: product.sizes || [],
      images: product.images && product.images.map(img => typeof img === 'string' ? img : img.url),
      imageFiles: [],
      stock: product.stock || '',
    });
    setEditProductId(product._id);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Products</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
          <FiPlus />
          Add Product
          </motion.button>
        </div>

      {/* Form modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-800 text-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 h-32"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Sizes</label>
                <div className="flex gap-4 flex-wrap">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-lg ${
                        formData.sizes.includes(size)
                          ? 'bg-purple-600'
                          : 'bg-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {formData.images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
                >
                  {loading ? (editProductId ? 'Updating...' : 'Adding Product...') : (editProductId ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditProductId(null); }}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-400">
            No products found. Add your first product!
          </div>
        ) : (
          products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-gray-700 overflow-hidden">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? typeof product.images[0] === 'string'
                        ? product.images[0]
                        : product.images[0].url || 'https://via.placeholder.com/300'
                      : 'https://via.placeholder.com/300'
                  }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-bold">${product.price}</span>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 p-2 rounded-lg" onClick={() => handleEditProduct(product)}>
                      <FiEdit2 />
                    </button>
                    <button className="bg-red-600 p-2 rounded-lg" onClick={() => handleDeleteProduct(product._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerProducts;
