const cart = require("./cartController");
const {Order, Product} = require("../db/models/modelCollection");


const placeOrder = async (customerid, hubid) => {
  try {
    const cart = await Cart.findOne({customer: customerid});
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
    return order
  } catch (err) {
    console.error(err);   
  }
}

const getOrderHistory = async (customerid) => {
  try {
    const orders = await Order.find({customer: customerid});
    return orders
  } catch (err) {
    console.error(err);
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
    return order
  } catch (err) {
    console.error(err);
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
    return order
  } catch (err) {
    console.error(err);
  }
};

const getOrderById = async (orderid) => {
  try {
    const order = await Order.findById(orderid);
    return order
  } catch (err) {
    console.error(err);
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
