const {Cart} = require('../db/models/modelCollection')
const {sendResponse} = require('../middleware/middleware');
const HttpStatus = require('../utils/commonHttpStatus')

const getCart = async (customerid) => {
  try {
    const cart = await Cart.findOne({customer: customerid}).populate('items.product');
    if (cart) return sendResponse(HttpStatus.OK_STATUS, "ok", cart);

    return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Get cart failed: ${err}`);
  }
}

const addProductToCart = async (customerid, product, quantity) => {
  try {
    let cart = await Cart.findOne({customer: customerid});

    if (cart == null) return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");

    let exist = false
    for (let i=0; i<cart.items.length; i++) {
      if (cart.items[i].product == product) {
        cart.items[i].quantity += quantity;
        exist = true
        break;
      }
    }
    if (!exist) cart.items.push({product: product, quantity: quantity});
    cart = await cart.save();
    return sendResponse(HttpStatus.OK_STATUS, "Added product to cart", cart);

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Add product to cart failed: ${err}`);
  }
}

const deleteProductInCart = async (customerid, productid) => {
  try {
    let cart = await Cart.findOne({customerid});
    if (cart == null) return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");

    cart.items = cart.items.filter(function(item) {
      return item.product != productid
    })
    cart = await cart.save()
    return sendResponse(HttpStatus.OK_STATUS, "Removed product from cart", cart);

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Remove product failed: ${err}`);

  }
}

// call emptyCart after placing order
const emptyCart = async (customerid) => {
  try {
    let cart = await Cart.findOneAndUpdate({customer: customerid}, {items: []}, {new: true});
    return cart;

  } catch (err) {
    throw(err)
  }
}

module.exports = {addProductToCart, deleteProductInCart, getCart, emptyCart}
