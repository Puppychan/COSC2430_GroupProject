const {Order, Product, Cart} = require("../db/models/modelCollection");
const {sendResponse} = require('../middleware/middleware');
const HttpStatus = require('../utils/commonHttpStatus')


const placeOrder = async (customerid, hubid) => {
  try {
    const cart = await Cart.findOne({customer: customerid});
    if (cart == null) return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");

    let items_final = []
    let total_price = 0;
    for (item of cart.items) {
      let product = await Product.findById(item.product);
      if (product) {
        items_final.push({product: product, quantity: item.quantity});
        total_price += product.price*item.quantity;
      }
    }
    const order = await Order.create({customer: customerid, items: items_final, total_price: total_price, hub: hubid, status: 'active'})
    return sendResponse(HttpStatus.OK_STATUS, "Placed order successfully", {order});

  } catch (err) {
    console.error(err);   
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Place order failed: ${err}`);

  }
}

const getOrderHistory = async (customerid) => {
  try {
    const orders = await Order.find({customer: customerid});
    return sendResponse(HttpStatus.OK_STATUS, "ok", {orders});
  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Get order history failed: ${err}`);
  }
};


const assignShipper = async (orderid, shipperid) => {
  try {
    const order = await Order.findOneAndUpdate(
        {_id: orderid}, 
        { $set: 
          {shipper : shipperid}
        }
      );

    if (order) return sendResponse(HttpStatus.OK_STATUS, "Assigned shipper successfully", {order});

    return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No order is found the with given id");
    
  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Assign shipper failed: ${err}`);
  }
};

const updateOrderStatus = async (orderid, status) => {
  try {
    const order = await Order.findOneAndUpdate(
        {_id: orderid}, 
        { $set: 
          {status : status}
        }
      );
    if (order) return sendResponse(HttpStatus.OK_STATUS, "Update status successfully", {order});
    
    return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No order is found the with given id");

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Update status failed: ${err}`);
  }
};

const getOrderById = async (orderid) => {
  try {
    const order = await Order.findById(orderid);
    if (order) return sendResponse(HttpStatus.OK_STATUS, "ok", {order});
    return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No order is found the with given id");
  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Get order failed: ${err}`);
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
