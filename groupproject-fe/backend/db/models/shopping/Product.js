// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Authors: Tran Mai Nhung - s3879954
//          Tran Nguyen Ha Khanh - s3877707
//          Nguyen Vinh Gia Bao - s3986287
//          Ton That Huu Luan - s3958304
//          Ho Van Khoa - s3997024
// Acknowledgement: 
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [10, '10 characters at least'],
    maxLength: [50, '50 characters at most']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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







