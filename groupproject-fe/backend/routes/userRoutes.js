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
const user = require('../controller/userController')
const { verifyUser } = require('./middleware')
const router = express.Router()

router.post('/register', user.register)
router.post('/login', user.login)
router.post('/update', verifyUser, user.updateProfile)
router.route('/my-account').get(verifyUser, user.getUserInfo)
router.route('/:id').get(user.getUser_no_verify)
router.route('/change-password').post(verifyUser, user.changePassword)

module.exports = router
