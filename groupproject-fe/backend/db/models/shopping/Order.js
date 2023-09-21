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
const Product = require('./Product').schema;

const orderItemSchema = new mongoose.Schema({
  product: { type: Product, required: true },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1, got {VALUE}']
  }
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shipper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  hub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hub',
    required: true
  },
  items: [{
    type: orderItemSchema,
    validate: [function (v) {
      return (v != null && v !== undefined && v.length != 0)
    }, 'Order item list cannot be empty']
  }],
  total_price: {
    type: Number,
    required: true,
    min: [0, 'Total price must be positive number']
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['active', 'delivered', 'canceled'],
      message: 'Order status {VALUE} is not supported'
    },
    default: 'active'
  },
  createAt: { type: Date, default: Date.now, required: true },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;







