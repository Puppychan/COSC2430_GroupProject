const mongoose = require("mongoose");

// MongoDB Atlas connection string, replace this string with your own
const mongoUrl = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB ...')
    await mongoose.connect(
      process.env.MONGODB_URI,
      {useNewUrlParser: true, useUnifiedTopology: true}
    )
    console.log('MongoDB connection SUCCESS');
  } catch (err) {
    console.error('MongoDB connection FAIL', err)
    throw(err)
  }
}

module.exports = {connectDB};
