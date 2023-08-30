require('dotenv').config()
const {connectDB} = require('./connectDB');
const {User, Customer, Shipper, Vendor, Hub, Product} = require('./models/modelScript');
const {productData, hubData, userData, customerData, vendorData, shipperData} = require('./data/dataScript');

connectDB()

const importData = () => {
  try {
    Product.collection.drop();
    Customer.collection.drop();
    Vendor.collection.drop();
    Shipper.collection.drop();
    User.collection.drop();
    Hub.collection.drop();
    

    Hub.insertMany(hubData);
    User.insertMany(userData);
    Customer.insertMany(customerData);
    Vendor.insertMany(vendorData);
    Shipper.insertMany(shipperData);
    Product.insertMany(productData)

    console.log('Data Import Success')
    process.exit()
  } catch (error) {
    console.error('Error with data import', error)
    process.exit(1)
  }
}

importData()
