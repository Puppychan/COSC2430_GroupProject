const {Cart} = require('../db/models/modelCollection')

const getCart = async (customerid) => {
  try {
    const cart = await Cart.findOne({customer: customerid});
    return cart
  } catch (err) {
    console.log(err)
  }
}

const addProductToCart = async (customerid, product, quantity) => {
  try {
    let cart = await Cart.findOne({customer: customerid});
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
    return cart;
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const deleteProductInCart = async (customerid, productid) => {
  try {
    let cart = await Cart.findOne({customerid});
    cart.items = cart.items.filter(function(item) {
      return item.product != productid
    })
    cart = await cart.save()
    return cart

  } catch (err) {
    console.log(err)
  }
}

module.exports = {addProductToCart, deleteProductInCart, getCart}
