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
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: [true, 'This user has been added to Customer before']
    },
    name: {
      type: String,
      required: true,
      minLength: [5, '5 characters at least']
    },
    address: {
      type: String,
      required: true,
      minLength: [5, '5 characters at least']
    }
  }
);

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;







