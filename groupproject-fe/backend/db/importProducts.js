require('dotenv').config()
const {connectDB} = require('./connectDB');
const {Product} = require('./models/modelCollection');
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
.then( () => {
  importData()
})
.catch((error) => {
  console.log(error)
});