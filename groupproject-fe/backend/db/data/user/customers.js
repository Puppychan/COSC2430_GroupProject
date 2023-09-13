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