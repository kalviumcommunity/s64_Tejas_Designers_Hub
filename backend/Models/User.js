const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String }, // for OAuth
  address: [{ 
    line1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
