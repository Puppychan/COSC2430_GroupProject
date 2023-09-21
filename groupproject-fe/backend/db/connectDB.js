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
const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB ...')
    await mongoose.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    console.log('MongoDB connection SUCCESS');
  } catch (err) {
    console.error('MongoDB connection FAIL', err)
    throw (err)
  }
}

module.exports = { connectDB };
