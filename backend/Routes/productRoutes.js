const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  imageUrls: [String],
  stock: Number,
  discount: Number,
  sizes: [String],
  isFeatured: Boolean,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Product', productSchema);
