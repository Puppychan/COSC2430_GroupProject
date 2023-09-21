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
const { Product } = require('./models/modelCollection');
const productData = require('./data/shopping/products')

const importData = async () => {
  try {
    console.log("importing products")
    // drop all collections
    await Promise.all([
      Product.deleteMany({}),
    ]);
    // drop all collections
    await Promise.all([
      Product.insertMany(productData)
    ]);

    console.log('Products Import Success')
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