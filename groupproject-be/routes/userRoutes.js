const express = require('express')
const user = require('../controller/userController')
const {verifyUser} = require('./middleware')
const router = express.Router()
var bodyParser = require('body-parser');

router.post('/register', user.register1)
router.post('/login', user.login)
router.route('/my-account').get([verifyUser], user.getUserInfo)
router.route('/:id').get(user.getUser_no_verify)
router.route('/change-password').post([verifyUser], user.changePassword)

module.exports = router
