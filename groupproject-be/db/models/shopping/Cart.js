const mongoose = require('mongoose');
const Product = require('./Product');

const cartItemSchema = new mongoose.Schema(
  {
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
  },
  { _id: false}
);

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;







