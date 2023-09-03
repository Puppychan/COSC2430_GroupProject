require('dotenv').config()
const {connectDB} = require('./connectDB');
const {User, Customer, Shipper, Vendor, Hub, Product} = require('./models/modelScript');
const productData = require('./data/shopping/products')
const hubData = require('./data/shopping/hubs')
const users_register = require('./data/user/user_register')
const {register_sample} = require('../controller/userController');

const insertUsers = () => {
  users_register.forEach( async (user_register) => {
    await register_sample(user_register);
  })
}

const importData = async () => {
  try {
    await Promise.all([
      Product.collection.drop(),
      Customer.collection.drop(),
      Vendor.collection.drop(),
      Shipper.collection.drop(),
      User.collection.drop(),
      Hub.collection.drop(),
      Hub.insertMany(hubData),
      insertUsers(),
      Product.insertMany(productData)
    ]);

    console.log('Data Import Success')
  } catch (error) {
    console.error('Error with data import', error)
  }
}

connectDB()
importData()