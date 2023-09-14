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
