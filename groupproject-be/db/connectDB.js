const mongoose = require("mongoose");

// MongoDB Atlas connection string, replace this string with your own
const mongoUrl =
  "mongodb+srv://s3877707:cosc2430group@groupwebprogramming.fnigakp.mongodb.net/"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || mongoUrl, { useNewUrlParser: true })
    console.log('MongoDB connection SUCCESS')
  } catch (error) {
    console.error('MongoDB connection FAIL')
    process.exit(1)
  }
}

module.exports = {connectDB};
