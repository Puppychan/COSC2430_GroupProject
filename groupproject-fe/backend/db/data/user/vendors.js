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
const { ObjectId } = mongoose.Types;
const vendors = [
  {
    _id: new ObjectId('00000001db42a4ac30ff65a1'),
    user: "00000001db42a4ac30ff65a1",
    name: "Vendor 1",
    address: "Vendor 1 address"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65a2'),
    user: "00000001db42a4ac30ff65a2",
    name: "Vendor 2",
    address: "Vendor 2 address"
  },
]

module.exports = vendors