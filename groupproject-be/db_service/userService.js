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

// this function return register user status: true if success, false if fail
const register_user = async (username, password, role, avatar) => {
  try {
    // info is a json object that contains specific infomation of that role
    const hash = await bcrypt.hash(password, 8);
    let newuser = new User;
    newuser.username = username;
    newuser.password = hash;
    newuser.role = role;
    if (avatar) newuser.avatar = avatar;

    newuser = await newuser.save();
    return newuser;
  } catch (err) {
    console.log("cannot create user: ", err)
    return null
  }
}

// this function return register status: true if success, false if fail
const register_customer_vendor = async (username, password, role, avatar, name, address) => {
  try {
    const newuser = register_user(username, password, role, avatar);
    if (newuser == null) return false;

    let newaccount = null;
    if (role == 'customer') {
      newaccount = await Customer.create({_id: new ObjectId(newuser._id), user: newuser._id, name: name, address: address})
    }
    else if (role == 'vendor') {
      newaccount = await Vendor.create({_id: new ObjectId(newuser._id), user: newuser._id, name: name, address: address})
    }
    else return false

    return true;
  } catch (err) {
    console.log("cannot create customer/vendor: ", err)
    return false
  }
}

// register_shippper() returns register status: true if success, false if fail
const register_shippper = async (username, password, role, avatar, name, hubid) => {
  try {
    const newuser = register_user(username, password, role, avatar);
    if (newuser == null) return false;

    let newaccount = null;
    if (role == 'shipper') {
      newaccount = await Shipper.create({_id: new ObjectId(newuser._id), user: newuser._id, name: name, hub: hubid})
    }
    else return false

    return true;
  } catch (err) {
    console.log("cannot create shipper: ", err)
    return false
  }
}


// login(sername, password) returns login status in the following format
// {status, message, token}
// where:
//  - status: true if login succeed, false if fail
//  - message: more details on the cause of such login status 
//  - token: if login succeed -> return a token (the frontend should store token to localstorage)
const login = async (username, password) => {
  try {
    const user = await User.findOne({'username': username})
    if (!!!user) {
      return {status: false, message: "Username does not exist"}
    }

    const same = await checkPassword(password, user.password)
    if (same) {
      let token = newToken(user)
      return {status: true, message: "Login successfully", token: token}
    }
    return {status: false, message: "Login failed. Wrong password"}
  } catch (err) {
    console.log(err)
    return {status: false, message: `Login failed: ${err}`}
  }
}

const getUserInfo = async (req) => {
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
    return full_info
  } catch (err) {
    console.log(`cannot get user: `, err)
    return null
  }
}

const getUser_no_verify = async (id) => {
  try {
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
    return full_info
  } catch (err) {
    console.log(`cannot get user with id ${id}: `, err)
    sendResponse(res, 500, `Error ${err}`);
  }
}

// changePassword() returns change password status in the following format
// {status, message}
// where:
//  - status: true if login succeed, false if fail
//  - message: more details on the cause of such login status 
const changePassword = async (current_pw, new_pw) => {
  try {
    var user = await User.findOne({_id: req.user._id});
    const same = await checkPassword(current_pw, user.password);
    if (same) {
      const hash = await bcrypt.hash(new_pw, 8);
      user = await User.findByIdAndUpdate(user._id, {password: hash});
      return {status: true, message: "Password is updated"}
    }
    return {status: false, message: "Current password is wrong"}
  } catch (err) {
    console.log("cannot change password: ", err)
    return {status: false, message: `Update password failed: ${err}`}
  }
}
module.exports = {register_sample, register_user, register_customer_vendor, register_shippper, login, getUserInfo, getUser_no_verify, changePassword}
