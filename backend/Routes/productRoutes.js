const express = require('express');
const router = express.Router();
const Product = require('../Models/product');

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products', error: err.message });
  }
});

// @desc    Create a new product
// @route   POST /api/products
router.post('/', async (req, res) => {
  const {
    title = "Sample Product",
    description = "This is a sample product.",
    price = 99.99,
    category = "Accessories",
    imageUrls = ["https://via.placeholder.com/300x400"],
    stock = 10,
    discount = 5,
    seller, // Make sure to pass a valid seller/user ID here
    isFeatured = false
  } = req.body;

  const newProduct = new Product({
    title,
    description,
    price,
    category,
    imageUrls,
    stock,
    discount,
    seller,
    isFeatured
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// PUT: Update a product by ID
router.put('/:id', async (req, res) => {
    const productId = req.params.id;
  
    const {
      title,
      description,
      price,
      category,
      imageUrls,
      stock,
      discount,
      isFeatured
    } = req.body;
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          title,
          description,
          price,
          category,
          imageUrls,
          stock,
          discount,
          isFeatured
        },
        { new: true, runValidators: true } // return updated doc and validate
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
      res.status(500).json({ message: 'Error updating product', error: err.message });
    }
  });
  

module.exports = router;
