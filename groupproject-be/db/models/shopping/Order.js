const mongoose = require('mongoose');
const Product = require('./Product');

const orderItem = new mongoose.Schema({
  product: {type: Product, required: true},
  quantiy: {
    type: Number, 
    required: true,
    min: [1, 'Quantity must be at least 1, got {VALUE}']
  }
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  hub: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hub',
    required: true
  },
  shipper: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  items: [orderItem],
  items_mapped_by_vendor: {
    type: Map, // `items_by_vendor` is a key/value store for string keys
    of: [orderItem],
  },
  total_price: {
    type: Number, 
    required: true,
    min: [0, 'Total price must be positive number']
  },
  state: {
    type: String, 
    required: true,
    enum: {
      values: ['active', 'delivered', 'canceled'],
      message: '{VALUE} is not supported'
    },
    default: 'active'
  },
  createAt: {type: Date, required: true, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;







