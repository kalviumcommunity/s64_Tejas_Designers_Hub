const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Product = require('../Models/Product');
const authenticateSeller = require('../middleware/authMiddleware');
const { getSellerProducts, addProduct } = require('../controllers/productController');
const { upload, cloudinary } = require('../config/cloudinary');

// Set up Multer storage for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadMulter = multer({ storage });

/**
 * @route   POST /
 * @desc    Create product with form data and uploaded images
 */
router.post('/', authenticateSeller, uploadMulter.array('images'), async (req, res) => {
  try {
    console.log('Creating product with seller:', req.seller._id);
    console.log('Received product data:', req.body);
    
    // Extract and validate required fields
    const { name, description, price, category, sizes, stock } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, and category are required' 
      });
    }
    
    // Parse price as number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }
    
    // Parse sizes - handle different input formats
    let parsedSizes = [];
    if (typeof sizes === 'string') {
      try {
        // Handle JSON string
        if (sizes.startsWith('[')) {
          parsedSizes = JSON.parse(sizes);
        } 
        // Handle comma-separated string
        else if (sizes.includes(',')) {
          parsedSizes = sizes.split(',').map(s => s.trim());
        }
        // Handle single value
        else {
          parsedSizes = [sizes];
        }
      } catch (e) {
        console.error('Error parsing sizes:', e);
        parsedSizes = [sizes]; // Fallback to treating as single size
      }
    } else if (Array.isArray(sizes)) {
      parsedSizes = sizes;
    }
    
    // Get image paths from uploaded files
    const formattedImages = req.files.map((file) => ({
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      publicId: file.filename
    }));

    // Create and save the product
    const newProduct = new Product({
      name,
      description,
      price: parsedPrice,
      category,
      sizes: parsedSizes,
      stock: parseInt(stock) || 1,
      images: formattedImages,
      seller: req.seller._id
    });

    console.log('Saving product:', {
      name: newProduct.name,
      price: newProduct.price,
      category: newProduct.category,
      sizes: newProduct.sizes,
      seller: newProduct.seller
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Upload failed", error);
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   GET /
 * @desc    Get all products
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Debugging route to check authentication
router.get('/debug-auth', authenticateSeller, (req, res) => {
  res.status(200).json({
    message: 'Authentication successful',
    seller: req.seller
  });
});

// Get a specific product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   POST /json
 * @desc    Create product with JSON data (for pre-uploaded images)
 */
router.post('/json', authenticateSeller, express.json(), async (req, res) => {
  try {
    console.log('Creating product (JSON) with seller:', req.seller._id);
    console.log('Received JSON product data:', req.body);
    
    const { name, description, price, category, sizes, stock, images } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, and category are required' 
      });
    }
    
    // Ensure images are properly formatted
    let formattedImages;
    if (images && images.length > 0) {
      formattedImages = images.map(img => {
        // If image is already properly formatted with url and publicId
        if (img.url && img.publicId) {
          return img;
        }
        // If image is just a string URL
        if (typeof img === 'string') {
          return {
            url: img,
            publicId: img.split('/').pop() // Extract filename as publicId
          };
        }
        // Return the image object as is
        return img;
      });
    } else {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    
    const product = new Product({
      name,
      description,
      price,
      category,
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      stock: stock || 1,
      images: formattedImages,
      seller: req.seller._id
    });
    
    console.log('Saving JSON product:', {
      name: product.name,
      price: product.price,
      category: product.category,
      sizes: product.sizes,
      images: product.images.length,
      seller: product.seller
    });
    
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Product creation failed:', err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   POST /upload
 * @desc    Upload product images using Cloudinary
 */
router.post('/upload', authenticateSeller, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Get the URLs and public IDs from the Cloudinary response
    const imageData = req.files.map(file => ({
      url: file.path, // Cloudinary provides the full URL in path
      publicId: file.filename // Cloudinary filename contains the public ID
    }));
    
    console.log('Images uploaded to Cloudinary:', imageData);
    
    res.status(200).json({
      message: 'Images uploaded successfully',
      images: imageData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
});

// Update a product
router.patch('/:id', authenticateSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Check if the seller owns this product
    if (product.seller.toString() !== req.seller.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', authenticateSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Check if the seller owns this product
    if (product.seller.toString() !== req.seller.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if uploaded files exist
router.get('/check-uploads', (req, res) => {
  try {
    const uploadPath = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadPath)) {
      return res.status(404).json({ 
        success: false,
        message: 'Uploads directory does not exist' 
      });
    }
    
    // Read the uploads directory
    const files = fs.readdirSync(uploadPath);
    
    res.status(200).json({
      success: true,
      message: 'Uploads directory exists',
      filesCount: files.length,
      files: files.slice(0, 10), // Return first 10 files to avoid large response
      uploadsPath: uploadPath
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking uploads',
      error: error.message
    });
  }
});

// Check Cloudinary configuration
router.get('/check-cloudinary', async (req, res) => {
  try {
    // Check if cloudinary is configured
    const cloudConfig = cloudinary.config();
    
    // Don't send back the API secret
    const safeConfig = {
      cloud_name: cloudConfig.cloud_name,
      api_key: cloudConfig.api_key ? 'configured' : 'missing',
      api_secret: cloudConfig.api_secret ? 'configured' : 'missing',
      secure: cloudConfig.secure
    };
    
    res.status(200).json({
      success: true,
      message: 'Cloudinary configuration retrieved',
      config: safeConfig,
      isFullyConfigured: !!(cloudConfig.cloud_name && cloudConfig.api_key && cloudConfig.api_secret)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking Cloudinary configuration',
      error: error.message
    });
  }
});

// Get products by seller ID
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }
    
    const products = await Product.find({ seller: sellerId });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', authenticateSeller, uploadMulter.array('images'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Ensure only the owner can update
    if (product.seller.toString() !== req.seller.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const { name, description, price, category, sizes, stock, replaceImages } = req.body;

    let parsedSizes = [];
    if (typeof sizes === 'string') {
      try {
        if (sizes.startsWith('[')) {
          parsedSizes = JSON.parse(sizes);
        } else if (sizes.includes(',')) {
          parsedSizes = sizes.split(',').map(s => s.trim());
        } else {
          parsedSizes = [sizes];
        }
      } catch (e) {
        parsedSizes = [sizes];
      }
    } else if (Array.isArray(sizes)) {
      parsedSizes = sizes;
    }

    // Prepare new images if any were uploaded
    let formattedImages = product.images || [];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        publicId: file.filename
      }));

      if (replaceImages === 'true') {
        // Optional: Delete old images from disk or Cloudinary if needed
        formattedImages = newImages;
      } else {
        formattedImages = [...formattedImages, ...newImages];
      }
    }

    // Update the product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.category = category || product.category;
    product.stock = stock ? parseInt(stock) : product.stock;
    product.sizes = parsedSizes.length > 0 ? parsedSizes : product.sizes;
    product.images = formattedImages;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);

  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
