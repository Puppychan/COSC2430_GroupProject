require('dotenv').config()
const mongoose = require("mongoose");
const {connectDB} = require('./connectDB');
const {User, Customer, Shipper, Vendor, Hub, Product} = require('./models/modelScript');
// const {productData, hubData, userData, customerData, vendorData, shipperData} = require('./data/dataScript');
const productData = require('./data/shopping/products')
const hubData = require('./data/shopping/hubs')
const userData = require('./data/user/users')
const customerData = require('./data/user/customers')
const vendorData = require('./data/user/vendors')
const shipperData = require('./data/user/shippers')

const importData = async () => {
  try {
    await Product.collection.drop();
    await Customer.collection.drop();
    await Vendor.collection.drop();
    await Shipper.collection.drop();
    await User.collection.drop();
    await Hub.collection.drop();
    await Hub.insertMany(hubData);
    await User.insertMany(userData);
    await Customer.insertMany(customerData);
    await Vendor.insertMany(vendorData);
    await Shipper.insertMany(shipperData);
    await Product.insertMany(productData);

    console.log('Data Import Success')
    process.exit()
  } catch (error) {
    console.error('Error with data import', error)
    process.exit(1)
  }
}

connectDB()
importData()


// Product.collection.drop();
// Customer.collection.drop();
// Vendor.collection.drop();
// Shipper.collection.drop();
// User.collection.drop();
// Hub.collection.drop();


// Hub.insertMany(hubData);
// User.insertMany(userData);
// Customer.insertMany(customerData);
// Vendor.insertMany(vendorData);
// Shipper.insertMany(shipperData);
// Product.insertMany(productData)
