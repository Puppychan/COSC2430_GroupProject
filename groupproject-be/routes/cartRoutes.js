const express = require('express')
const cart = require('../controller/cartController')
const {verifyUser, verifyAction} = require('./middleware')
const router = express.Router()

router
.route('/:userid')
.post(verifyUser, verifyAction, cart.addProductToCart)
.get(verifyUser, verifyAction, cart.getCart)

router
.route('/:userid/:productid')
.delete(verifyUser, verifyAction, cart.deleteProductInCart)

module.exports = router
