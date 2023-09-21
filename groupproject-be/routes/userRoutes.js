const express = require('express')
const {
  register,
  login,
  getUserInfo,
  changePassword
} = require('../controller/userController')
const {verifyUser} = require('./middleware')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.route('/account').get(getUserInfo)
router.route('/change-password').post(changePassword)


module.exports = router
