const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [10, '10 characters at least'],
    maxLength: [20, '20 characters at most']
  },
  vendor: {
    type:mongoose.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  // vendor_username: {type: String, required: true},
  image: {
    type: String,
    default: 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'
  },
  price: {
    type: Number, 
    required: true,
    min: [0, 'Price must be positive number, got {VALUE}'],
  },
  stock: {
    type: Number, 
    required: true,
    min: [0, 'Stock must be positive number, got {VALUE}'],
  },
  description: {
    type: String,
    maxLength: [500, '500 characters at most'],
    default: 'Product description to be updated'
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;







