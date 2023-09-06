const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const users_register = [
  {
    user: {
      _id: new ObjectId('00000001db42a4ac30ff65c1'),
      username: "customer01",
      password: "User123@",
      role: "customer"
    },
    info: {
      name: "Customer 1",
      address: "Customer 1 address"
    }
  },
  {
    user: {
      _id: new ObjectId('00000001db42a4ac30ff65c2'),
      username: "customer02",
      password: "User123@",
      role: "customer"
    },
    info: {
      name: "Customer 2",
      address: "Customer 2 address"
    }
  },
  {
    user: {
      _id: new ObjectId('00000001db42a4ac30ff65a1'),
      username: "vendor01",
      password: "User123@",
      role: "vendor"
    },
    info: {
      business_name: "Vendor 1",
      business_address: "Vendor 1 address"
    }
  },
  {
    user: {
      _id: new ObjectId('00000001db42a4ac30ff65a2'),
      username: "vendor02",
      password: "User123@",
      role: "vendor"
    },
    info: {
      business_name: "Vendor 2",
      business_address: "Vendor 2 address"
    }
  },
  {
    user: {
      _id: new ObjectId('00000001db42a4ac30ff65b1'),
      username: "shipper01",
      password: "User123@",
      role: "shipper"
    },
    info: {
      name: "Shipper 1",
      hub: "00000001db42a4ac30ff65d1",
    }
  },
  {
    user: {
      _id: new ObjectId('00000001db42a4ac30ff65b2'),
      username: "shipper02",
      password: "User123@",
      role: "shipper"
    },
    info: {
      name: "Shipper 2",
      hub: "00000001db42a4ac30ff65d2",
    }
  },
]

module.exports = users_register;