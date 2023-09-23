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
const { Cart } = require('../db/models/modelCollection')
const { sendResponse } = require('../middleware/middleware');
const HttpStatus = require('../utils/commonHttpStatus')

const getCart = async (customerid) => {
  try {
    // const cart = await Cart.findOne({customer: customerid}).populate('items.product');
    const cart = await Cart.aggregate([
      { $match: { customer: customerid } }, 
      { $unwind: '$items' },
      {  // Lookup product by id
        $lookup: {
          from: 'products', 
          localField: 'items.product', 
          foreignField: '_id', 
          as: 'items.product' 
        }
      },
      { $unwind: '$items.product' }, // Unwind the product array
      { // Group by cart id
        $group: {
          _id: '$_id',
          items: { // Push items into array
            $push: {
              product: '$items.product',
              quantity: '$items.quantity'
            }
          },
          totalPrice: { $sum: { $multiply: ['$items.product.price', '$items.quantity'] } }, // Calculate total price
        }
      }
    ]);
    if (cart) return sendResponse(HttpStatus.OK_STATUS, "ok", { cart });

    return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Get cart failed: ${err}`);
  }
}

const addProductToCart = async (customerid, product, quantity) => {
  try {
    let cart = await Cart.findOne({ customer: customerid });

    if (cart == null) return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");

    let exist = false
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].product == product) {
        cart.items[i].quantity += quantity;
        exist = true
        break;
      }
    }
    if (!exist) cart.items.push({ product: product, quantity: quantity });
    cart = await cart.save();
    return sendResponse(HttpStatus.OK_STATUS, "Added product to cart", { cart });

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Add product to cart failed: ${err}`);
  }
}

const updateProductInCart = async (customerid, productid, quantity) => {
  try {
    let cart = await Cart.findOne({ customer: customerid });
    if (cart == null) return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");
    
    let exist = false;
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].product == productid) {
        // if quantity is 0, remove the product from cart
        if (quantity == 0) {
          cart.items.splice(i, 1);
          exist = true;
          break;
        }
        cart.items[i].quantity = quantity;
        exist = true;
        break;
      }
    }
    if (!exist) return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No product is found the with given product id");
    cart = await cart.save()
    return sendResponse(HttpStatus.OK_STATUS, "Updated product in cart", { cart });

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Update product failed: ${err}`);
  }
}

const deleteProductInCart = async (customerid, productid) => {
  try {
    let cart = await Cart.findOne({ customer: customerid });
    if (cart == null) return sendResponse(HttpStatus.NOT_FOUND_STATUS, "No cart is found the with given user id");

    cart.items = cart.items.filter(function (item) {
      return item.product != productid
    })
    cart = await cart.save()
    return sendResponse(HttpStatus.OK_STATUS, "Removed product from cart", { cart });

  } catch (err) {
    return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Remove product failed: ${err}`);

  }
}

// call emptyCart after placing order
const emptyCart = async (customerid) => {
  try {
    let cart = await Cart.findOneAndUpdate({ customer: customerid }, { items: [] }, { new: true });
    return cart;

  } catch (err) {
    throw (err)
  }
}

module.exports = { addProductToCart, deleteProductInCart, getCart, emptyCart, updateProductInCart }
