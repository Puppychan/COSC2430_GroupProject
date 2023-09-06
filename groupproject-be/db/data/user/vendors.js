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