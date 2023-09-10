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