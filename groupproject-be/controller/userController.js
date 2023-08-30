const bcrypt = require('bcrypt')
const Customer = require('../db/models/user/Customer')
const Vendor = require('../db/models/user/Vendor')
const Shipper = require('../db/models/user/Shipper')
const User = require('../db/models/user/User')
const {sendResponse} = require('../routes/middleware');
const {checkPassword, newToken} = require('../utils/verification')

const register = async (req, res) => {
  const {password} = req.body
  try {
    const hash = await bcrypt.hash(password, 8)
    const user = await User.create({...req.body, password: hash})
    sendResponse(res, 200, 'Sucessfully register', {user, password:0});
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const login = async (req, res) => {
  const {username, password} = req.body
  try {
    const user = await User.findOne({'username': username})
    if (!!!user) {
      sendResponse(res, 404, `No account with username ${username}`);
      return
    }

    const same = await checkPassword(password, user.password)
    if (same) {
      let token = newToken(user)
      sendResponse(res, 200, 'ok', token);
      return
    }

    sendResponseError(400, 'Invalid password', res)
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}


const getUserInfo = async (req, res) => {
  const role = req.user.role;
  var info = null;

  try {
    const user = User.findById(req.user._id);
    if (role == 'customer') {
      info = await Customer.findOne({'userid': req.user._id})
    }
    else if (role == 'vendor') {
      info = await Vendor.findOne({'userid': req.user._id})
    }
    else if (role == 'shipper') {
      info = await Shipper.findOne({'userid': req.user._id})
    }

    sendResponse(res, 200, `ok`, {user, info, password:0});
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const getUser_no_verify = async (req, res) => {
  try {
    const user = await User.findById(req.params.productid);
    const role = user.role;
    var info = null;
    if (role == 'customer') {
      info = await Customer.findOne({'userid': req.user._id})
    }
    else if (role == 'vendor') {
      info = await Vendor.findOne({'userid': req.user._id})
    }
    else if (role == 'shipper') {
      info = await Shipper.findOne({'userid': req.user._id})
    }

    sendResponse(res, 200, `ok`, {user, info, password:0});
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const changePassword = async (req, res) => {
  const {current_pw, new_pw} = req.body;
  try {
    var user = User.findById(req.user._id);
    const same = await checkPassword(current_pw, user.password);
    if (same) {
      const hash = await bcrypt.hash(new_pw, 8);
      user = await User.findByIdAndUpdate(user._id, {password: hash});
      sendResponse(res, 200, 'Updated password');
      return
    }
    sendResponseError(400, 'Invalid password', res)
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}
module.exports = {register, login, getUserInfo, getUser_no_verify, changePassword}
