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
const express = require("express");
const router = express.Router();
const order = require("../controller/orderController");
const { verifyUser, verifyAction } = require('./middleware')


router
.route('/place-order')
.post(verifyUser, order.placeOrder)

router
.route('/order-history')
.get(verifyUser, order.getOrderHistory)

router.post('/update-status/:orderid', order.updateOrderStatus)
router.post('/assign-shipper/:orderid', order.assignShipper)
router.get("/:orderid", order.getOrderDetails);



module.exports = router;
