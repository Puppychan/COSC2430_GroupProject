const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const vendors = [
  {
    _id: new ObjectId('00000001db42a4ac30ff65a1'),
    user: "00000001db42a4ac30ff65a1",
    business_name: "Vendor 1",
    business_address: "Vendor 1 address"
  },
  {
    _id: new ObjectId('00000001db42a4ac30ff65a2'),
    user: "00000001db42a4ac30ff65a2",
    business_name: "Vendor 2",
    business_address: "Vendor 2 address"
  },
]

module.exports = vendors