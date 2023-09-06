const mongoose = require("mongoose");

// MongoDB Atlas connection string, replace this string with your own
const mongoUrl = process.env.MONGODB_URI;

const connectDB = () => {
  console.log('Connecting to MongoDB ...')
  mongoose.connect(
    mongoUrl,
    {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => {
    console.log('MongoDB connection SUCCESS');
  })
  .catch((err) => {
    console.error('MongoDB connection FAIL', err)
  });
}

module.exports = {connectDB};
