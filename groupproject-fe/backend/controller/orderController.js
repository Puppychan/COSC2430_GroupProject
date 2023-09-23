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
const { Order, Product, Cart } = require("../db/models/modelCollection");
const {emptyCart} = require("./cartController");
const { sendResponse } = require("../routes/middleware");

const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({customer: req.user._id});
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

const getOrderDetails = async (req, res) => {
  try {
    let order = await Order.findById(req.params.orderid)
                          .populate('hub')
                          .populate('customer')
                          .populate('shipper');

    if (order == null)  
      sendResponse(res, 404, 'No order is found the with given id');

    let order_details = JSON.parse(JSON.stringify(order));

    let customer_details = await Customer.findOne({user: order.customer._id})
    order_details.customer = {...order_details.customer, name: customer_details.name, address: customer_details.address};

    let shipper_details = null
    if (order.shipper != null) {
      shipper_details = await Shipper.findOne({user: order.shipper._id})
      order_details.shipper = {...order_details.shipper, name: shipper_details.name};
  
    }
    sendResponse(res, 200, 'ok', order_details);
   
  } catch (err) {
    console.error(err);    
    sendResponse(res, 500, `Error ${err}`);
  }
};

const placeOrder = async (req, res) => {
  try {
    const customerid = req.user._id
    let cart = await Cart.findOne({customer: customerid});
    const {hub} = req.body;
    let items_final = []
    let total_price = 0;
    for (item of cart.items) {
      let product = await Product.findById(item.product);
      if (product) {
        items_final.push({ product: product, quantity: item.quantity });
        total_price += product.price * item.quantity;
      }
    }
    const order = await Order.create({customer: customerid, items: items_final, total_price: total_price, hub: hub, status: 'active'})
    cart = await emptyCart(customerid);
    sendResponse(res, 200, 'ok', {order, cart});
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

const getActiveOrdersInHub = async (hubid) => {
  try {
    const orders = await Order.find({hub: hubid, status: 'active'});
    return orders;
  } catch (err) {
    throw(err)
  }
}

module.exports = {
  getOrderHistory,
  getOrderById,
  getOrderDetails,
  placeOrder,
  updateOrderStatus,
  assignShipper,
  getActiveOrdersInHub
};
