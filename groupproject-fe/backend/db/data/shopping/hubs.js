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
const hubs = [
  {
    _id: new ObjectId('00000001db42a4ac30ff65d1'),
    name: "Ho Chi Minh",
    address: "69 HCM"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65d2'),
    name: "Ha Noi",
    address: "69 HN"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65d3'),
    name: "Da Nang",
    address: "69 DN"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65d4'),
    name: "Da Lat",
    address: "69 DL"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65d5'),
    name: "Hai Phong",
    address: "69 HP"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65d6'),
    name: "Nha Trang",
    address: "69 NT"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65d7'),
    name: "Binh Duong",
    address: "69 BD"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65d8'),
    name: "Vung Tau",
    address: "69 VT"
  },
];

module.exports = hubs;
