const express = require('express')
const cart = require('../controller/cartController')
const {verifyUser, verifyAction} = require('./middleware')
const router = express.Router()

router
.route('/')
.post(verifyUser, cart.addProductToCart)
.get(verifyUser, cart.getCart)

router
.route('/:productid')
.delete(verifyUser, cart.deleteProductInCart)

module.exports = router
