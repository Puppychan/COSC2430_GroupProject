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
const { ObjectId } = mongoose.Types;
const customers = [
  {
    _id: new ObjectId('00000001db42a4ac30ff65c1'),
    user: "00000001db42a4ac30ff65c1",
    name: "Customer 1",
    address: "Customer 1 address"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65c2'),
    user: "00000001db42a4ac30ff65c2",
    name: "Customer 2",
    address: "Customer 2 address"
  },
]

module.exports = customers;