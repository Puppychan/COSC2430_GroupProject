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
const cart = require("./cartController");
const { Order, Product, Cart } = require("../db/models/modelCollection");
const { sendResponse } = require("../routes/middleware");

const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.userid });
    sendResponse(res, 200, 'ok', orders);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, `Server Error ${err}`);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid);
    sendResponse(res, 200, 'ok', order);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, `Error ${err}`);
  }
};

const placeOrder = async (req, res) => {
  try {
    const customerid = req.params.userid
    const cart = await Cart.findOne({ customer: customerid });
    const { hub } = req.body;
    let items_final = []
    let total_price = 0;
    for (item of cart.items) {
      let product = await Product.findById(item.product);
      if (product) {
        items_final.push({ product: product, quantity: item.quantity });
        total_price += product.price * item.quantity;
      }
    }
    const order = await Order.create({ customer: customerid, items: items_final, total_price: total_price, hub: hub, status: 'active' })
    sendResponse(res, 200, 'ok', order);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, `Error ${err}`);
  }
}


const assignShipper = async (req, res) => {
  try {
    const { shipper } = req.body
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderid },
      {
        $set:
          { shipper: shipper }
      },
      { new: true }
    );
    sendResponse(res, 200, 'ok', order);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, `Error ${err}`);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderid },
      {
        $set:
          { status: status }
      },
      { new: true }
    );
    sendResponse(res, 200, 'ok', order);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, `Error ${err}`);
  }
};

// const randomHub = async () => {
//   try {
//     const hubs = await Hub.find();
//     let random_hub = hubs[Math.floor(Math.random()*hubs.length)];
//     return random_hub._id;
//   } catch (err) {
//     throw(err)
//   }
// }

module.exports = {
  getOrderHistory,
  getOrderById,
  placeOrder,
  updateOrderStatus,
  assignShipper
};
