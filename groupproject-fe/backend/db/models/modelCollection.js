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
const User = require('./user/User')
const Customer = require('./user/Customer')
const Vendor = require('./user/Vendor')
const Shipper = require('./user/Shipper')
const Hub = require('./shopping/Hub')
const Cart = require('./shopping/Cart')
const Order = require('./shopping/Order')
const Product = require('./shopping/Product')


module.exports = { User, Customer, Vendor, Shipper, Hub, Cart, Order, Product };
