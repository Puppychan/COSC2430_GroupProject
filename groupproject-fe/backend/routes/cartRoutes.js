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
const express = require('express')
const cart = require('../controller/cartController')
const { verifyUser, verifyAction } = require('./middleware')
const router = express.Router()

router
.route('/')
.post(verifyUser, cart.addProductToCart)
.get(verifyUser, cart.getCart)

router
.route('/:productid')
.delete(verifyUser, cart.deleteProductInCart)

module.exports = router
