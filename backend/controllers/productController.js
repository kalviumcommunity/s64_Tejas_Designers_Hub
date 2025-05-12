const Product = require('../Models/Product');

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category, sizes, stock } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      stock,
      sizes: sizes?.split(',') || [],
      createdBy: req.seller?.id || null,
      image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : undefined,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving product' });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get products' });
  }
};
