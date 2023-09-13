const {Order, Product, Hub, User} = require("../db/models/modelCollection");
const {sendResponse} = require("../routes/middleware");

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

const placeOrder = async (req, res) => {
  try {
    if (req.user.role != 'customer') throw new Error('Only customer user can make order')

    const {items, hub} = req.body;
    let items_final = []
    let total_price = 0;
    for (item of items) {
      let product = await Product.findById(item.product);
      if (product) {
        items_final.push({product: product, quantity: item.quantity});
        total_price += product.price*item.quantity;
      }
    }
    const order = await Order.create({customer: req.user._id, items: items_final, total_price: total_price, hub: hub, status: 'active'})
    sendResponse(res, 200, 'ok', order);
  } catch (err) {
    console.error(err);    
    sendResponse(res, 500, `Error ${err}`);
  }
}

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
  placeOrder
};
