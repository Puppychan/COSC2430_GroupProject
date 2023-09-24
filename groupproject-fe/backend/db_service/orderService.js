const {Order, Product, Cart, Customer, Shipper} = require("../db/models/modelCollection");
const {emptyCart} = require("./cartService");
const {checkStock, updateStock} = require('./productService')
const {sendResponse} = require('../middleware/middleware');
const HttpStatus = require('../utils/commonHttpStatus')


const placeOrder = async (customerid, hubid) => {
  try {
    let cart = await Cart.findOne({customer: customerid});
    if (cart == null) return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");

    let items_final = []
    let total_price = 0;
    for (item of cart.items) {
      let enoughStock = await checkStock(item.product, item.quantity);
      if (!enoughStock) return sendResponse(HttpStatus.FORBIDDEN_STATUS, "Product's stock is not enough");

      let product = await Product.findById(item.product);
      items_final.push({product: product, quantity: item.quantity});
      total_price += product.price*item.quantity;

      // decrease stock
      let updatedProduct = await updateStock(item.product, item.quantity*(-1));

    }
    const order = await Order.create({customer: customerid, items: items_final, total_price: total_price, hub: hubid, status: 'active'})

    cart = await emptyCart(customerid);

    return sendResponse(HttpStatus.OK_STATUS, "Placed order successfully", {order, cart});

  } catch (err) {
    console.error(err);
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Place order failed: ${err}`);

  }
}

const getOrderHistory = async (customerid) => {
  try {
    const orders = await Order.find({customer: customerid});
    return sendResponse(HttpStatus.OK_STATUS, "ok", orders);
  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Get order history failed: ${err}`);
  }
};


const assignShipper = async (orderid, shipperid) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderid },
      {
        $set:
          { shipper: shipperid }
      },
      { new: true }
    );

    if (order) return sendResponse(HttpStatus.OK_STATUS, "Assigned shipper successfully", order);

    return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No order is found the with given id");

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Assign shipper failed: ${err}`);
  }
};

const updateOrderStatus = async (orderid, status) => {
  try {
    const order = await Order.findOneAndUpdate(
        {_id: orderid}, {status : status}, {new: true}
      );

    if (order) {
      // increase product stock when order is canceled
      if (status == "canceled") {
        for (item of order.items) {
          await updateStock(item.product._id, item.quantity);
        }
      }
      return sendResponse(HttpStatus.OK_STATUS, "Update status successfully", order);
    }
    
    return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No order is found the with given id");

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Update status failed: ${err}`);
  }
};

const getOrderById = async (orderid) => {
  try {
    const order = await Order.findById(orderid);
    sendResponse(HttpStatus.OK_STATUS, "ok", order);
  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Get order failed: ${err}`);
  }
};

const getOrderDetails = async (orderid) => {
  try {
    let order = await Order.findById(orderid)
                          .populate('hub')
                          .populate('customer')
                          .populate('shipper');

    if (order == null)  
      return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No order is found the with given id");

    let order_details = JSON.parse(JSON.stringify(order));

    let customer_details = await Customer.findOne({user: order.customer._id})
    order_details.customer = {...order_details.customer, name: customer_details.name, address: customer_details.address};

    let shipper_details = null
    if (order.shipper != null) {
      shipper_details = await Shipper.findOne({user: order.shipper._id})
      order_details.shipper = {...order_details.shipper, name: shipper_details.name};
  
    }

    return sendResponse(HttpStatus.OK_STATUS, "ok", order_details);
   
  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Get order details failed: ${err}`);
  }
};


const getActiveOrdersInHub = async (hubid) => {
  try {
    const orders = await Order.find({hub: hubid, status: 'active'});
    return orders
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
