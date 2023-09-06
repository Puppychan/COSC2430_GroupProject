const bcrypt = require('bcrypt')
const Customer = require('../db/models/user/Customer')
const Vendor = require('../db/models/user/Vendor')
const Shipper = require('../db/models/user/Shipper')
const User = require('../db/models/user/User')
const {sendResponse} = require('../routes/middleware');
const {checkPassword, newToken} = require('../utils/verification')
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const register_sample = async (user_register) => {
  try {
    const {user, info} = user_register
    const hash = await bcrypt.hash(user.password, 8);
    const newuser = await User.create({...user, password: hash});
    const role = newuser.role;
    if (role == 'customer') {
      await Customer.create({...info, user: newuser._id, _id: new ObjectId(newuser._id)})
    }
    else if (role == 'vendor') {
      await Vendor.create({...info, user: newuser._id, _id: new ObjectId(newuser._id)})
    }
    else if (role == 'shipper') {
      await Shipper.create({...info, user: newuser._id, _id: new ObjectId(newuser._id)})
    }
  } catch (err) {
    console.log(err)
  }
}

const register = async (req, res) => {
  try {
    const {user, info} = req.body
    const hash = await bcrypt.hash(user.password, 8);
    const newuser = await User.create({...user, _id: new ObjectId(), password: hash});
    const role = newuser.role;
    var newinfo = null
    if (role == 'customer') {
      newinfo = await Customer.create({...info, user: newuser._id, _id: new ObjectId(newuser._id)})
    }
    else if (role == 'vendor') {
      newinfo = await Vendor.create({...info, user: newuser._id, _id: new ObjectId(newuser._id)})
    }
    else if (role == 'shipper') {
      newinfo = await Shipper.create({...info, user: newuser._id, _id: new ObjectId(newuser._id)})
    }
    sendResponse(res, 200, 'Sucessfully register', {user: newuser, info: newinfo});
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
  try {
    var full_info = null;
    if (req.user != null) {
      const role = req.user.role;
      const id = req.user._id
      if (role == 'customer') {
        full_info = await Customer.findOne({'user': id}).populate('user');
      }
      else if (role == 'vendor') {
        full_info = await Vendor.findOne({'user': id}).populate('user');
      }
      else if (role == 'shipper') {
        full_info = await Shipper.findOne({'user': id}).populate('user');
      }
      full_info.user.password = 0;
    }

    sendResponse(res, 200, `ok`, full_info);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const getUser_no_verify = async (req, res) => {
  try {
    var id = req.params.id
    const user = await User.findOne({_id: id});
    var full_info = null;
    if (user != null) {
      const role = user.role;
      if (role == 'customer') {
        full_info = await Customer.findOne({'user': id}).populate('user');
      }
      else if (role == 'vendor') {
        full_info = await Vendor.findOne({'user': id}).populate('user');
      }
      else if (role == 'shipper') {
        full_info = await Shipper.findOne({'user': id}).populate('user');
      }
      full_info.user.password = 0;
    }

    sendResponse(res, 200, `ok`, full_info);
  } catch (err) {
    console.log(err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

const changePassword = async (req, res) => {
  const {current_pw, new_pw} = req.body;
  try {
    var user = await User.findOne({_id: req.user._id});
    console.log(user)
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
module.exports = {register_sample, register, login, getUserInfo, getUser_no_verify, changePassword}
