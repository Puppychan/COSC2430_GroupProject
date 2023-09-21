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
require('dotenv').config()
const { connectDB } = require('./connectDB');
const { User, Customer, Shipper, Vendor, Hub, Product, Cart, Order } = require('./models/modelCollection');
const productData = require('./data/shopping/products')
const hubData = require('./data/shopping/hubs')
const users_register = require('./data/user/user_register')
const { register_sample } = require('../controller/userController');

const insertUsers = async () => {
  for (const user of users_register) {
    try {
      await register_sample(user)
    } catch (error) {
      console.error('Error import user', error)
    }
  }
}

const importData = async () => {
  try {
    console.log("importing data")
    // drop all collections
    await Promise.all([
      User.deleteMany({}),
      Customer.deleteMany({}),
      Vendor.deleteMany({}),
      Shipper.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Hub.deleteMany({}),
    ]);
    // drop all collections
    await Promise.all([
      Hub.insertMany(hubData),
      insertUsers(),
      Product.insertMany(productData)
    ]);

    console.log('Data Import Success')
  } catch (error) {
    throw (error)
  }
}

connectDB()
  .then(() => {
    importData()
  })
  .catch((error) => {
    console.log(error)
  });