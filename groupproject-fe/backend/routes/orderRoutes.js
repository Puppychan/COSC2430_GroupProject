const express = require("express");
const router = express.Router();
const order = require("../controller/orderController");
const {verifyUser, verifyAction} = require('./middleware')


router
.route('/place-order/:userid')
.post(verifyUser, verifyAction, order.placeOrder)

router
.route('/order-history/:userid')
.get(verifyUser, verifyAction, order.getOrderHistory)

router.post('/update-status/:orderid', order.updateOrderStatus)
router.post('/assign-shipper/:orderid', order.assignShipper)
router.get("/:orderid", order.getOrderById);



module.exports = router;
