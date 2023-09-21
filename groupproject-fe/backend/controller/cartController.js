const {Cart} = require('../db/models/modelCollection')
const {sendResponse} = require("../routes/middleware");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({customer: req.user._id}).populate('items.product');
    sendResponse(res, 200, 'ok', cart);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const addProductToCart = async (req, res) => {
  try {
    const {product, quantity} = req.body
    let cart = await Cart.findOne({customer: req.user._id});
    let exist = false
    for (let i=0; i<cart.items.length; i++) {
      if (cart.items[i].product == product) {
        cart.items[i].quantity += quantity;
        exist = true
        break;
      }
    }
    if (!exist) cart.items.push({product: product, quantity: quantity})
    cart = await cart.save()
    sendResponse(res, 200, 'added product to cart', cart);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const deleteProductInCart = async (req, res) => {
  try {
    const productid = req.params.productid
    let cart = await Cart.findOne({customer: req.user._id});
    cart.items = cart.items.filter(function(item) {
      return item.product != productid
    })
    cart = await cart.save()
    sendResponse(res, 200, 'deleted product in cart', cart);

  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const emptyCart = async (customerid) => {
  try {
    let cart = await Cart.findOneAndUpdate({customer: customerid}, {items: []}, {new: true});
    return cart;

  } catch (err) {
    throw(err)
  }
}

module.exports = {addProductToCart, deleteProductInCart, getCart, emptyCart}
