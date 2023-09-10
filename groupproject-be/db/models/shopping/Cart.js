const mongoose = require('mongoose');
const Product = require('./Product');

const cartItemSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true
  },
  quantiy: {
    type: Number, 
    required: true,
    default: 1,
    min: [1, 'Quantity must be at least 1, got {VALUE}']
  }
});

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CartItem',
  }]
});

const Cart = mongoose.model('Cart', cartSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = {Cart,CartItem};







