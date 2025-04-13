const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: 'No description provided' },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Accessories'],
    required: true
  },
  imageUrls: {
    type: [String],
    default: ['https://via.placeholder.com/300x400']
  },
  stock: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
