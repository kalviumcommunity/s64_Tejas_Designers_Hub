const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Returned'], default: 'Pending' },
  totalAmount: Number,
  paymentMethod: { type: String, enum: ['PayPal', 'Card'], default: 'PayPal' },
  address: {
    line1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
