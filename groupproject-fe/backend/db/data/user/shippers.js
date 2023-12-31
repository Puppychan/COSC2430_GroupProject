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
const shippers = [
  {
    _id: new ObjectId('00000001db42a4ac30ff65b1'),
    user: "00000001db42a4ac30ff65b1",
    name: "Shipper 1",
    hub: "00000001db42a4ac30ff65d1",
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65b2'),
    user: "00000001db42a4ac30ff65b2",
    name: "Shipper 2",
    hub: "00000001db42a4ac30ff65d2",
  },
]

module.exports = shippers;