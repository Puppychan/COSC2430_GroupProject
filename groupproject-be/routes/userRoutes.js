const express = require('express')
const {
  register,
  login,
  getUserInfo,
  getUser_no_verify,
  changePassword
} = require('../controller/userController')
const {verifyUser} = require('./middleware')
const router = express.Router()
var bodyParser = require('body-parser');

router.post('/register', register)
router.post('/login', login)
router.route('/my-account').get([verifyUser], getUserInfo)
router.route('/:id').get(getUser_no_verify)
router.route('/change-password').post([verifyUser], changePassword)

module.exports = router
