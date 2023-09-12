require('dotenv').config()
const {connectDB} = require('./connectDB');
const {User, Customer, Shipper, Vendor, Hub, Product} = require('./models/modelCollection');
const productData = require('./data/shopping/products')
const hubData = require('./data/shopping/hubs')
const users_register = require('./data/user/user_register')
const {register_sample} = require('../controller/userController');

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
    await Promise.all([   
      User.collection.drop(),
      Customer.collection.drop(),
      Vendor.collection.drop(),
      Shipper.collection.drop(),
      Product.collection.drop(),
      Hub.collection.drop(),
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
.then( async () => {
  await importData()
})
.catch((error) => {
  console.log(error)
});