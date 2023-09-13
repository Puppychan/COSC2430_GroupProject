const express = require("express");
const router = express.Router();
const order = require("../controller/orderController");
const {verifyUser, verifyAction} = require('./middleware')

router
.route('/:userid')
.post(verifyUser, verifyAction, order.placeOrder)
.get(verifyUser, verifyAction, order.getOrderHistory)

router.get("/:orderid", order.getOrderById);

module.exports = router;
