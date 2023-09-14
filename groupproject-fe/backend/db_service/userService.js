const bcrypt = require('bcrypt')
const {User, Customer, Vendor, Shipper} = require('../db/models/modelCollection')
const {sendResponse} = require('../routes/middleware');
const {checkPassword, newToken} = require('../utils/verification')

/*  this function register user (in both User collection and role's collection) 
  - example of all_info for customer:
{
  username: "hakhanhne",
  password: "password",
  role: "customer",
  avatar: "
  name: "Ha Khanh",
  address: "123 RMIT"
}
  - example of all_info for vendor:
{
  username: "hakhanhne",
  password: "password",
  role: "vendor",
  name: "Ha Khanh",
  address: "123 RMIT"
}
  - example of all_info for shipper:
{
  username: "hakhanhne",
  password: "password",
  role: "shipper",
  name: "Ha Khanh",
  hubid: "465937280q38296"
}

*/
const register = async (all_info) => {
  try {
    const {username, password, role, avatar, name, address, hubid} = all_info
    
    const hash = await bcrypt.hash(password, 8);
    const newuser = await User.create({username: username, password: hash, role: role, avatar: avatar})
    
    let info = null;
    if (role == 'customer') {
      info = await Customer.create({user: newuser._id, name: name, address: address})
    }
    else if (role == 'vendor') {
      info = await Vendor.create({ user: newuser._id, name: name, address: address})
    }
    else if (role == 'shipper') {
      info = await Shipper.create({user: newuser._id, name: name, hub: hubid})
    }
    else throw new Error("Role can only be customer, vendor, shipper")

    return {user: newuser, role_info: info};
  } catch (err) {
    console.log("cannot create user: ", err)
    throw(err)
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
      full_info.user.password = 0; // password is unrevealed
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
      full_info.user.password = 0; // password is unrevealed
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


// dont care this function, it is used to import sample data
const register_sample = async (user_register) => {
  try {
    const {user, info} = user_register
    const hash = await bcrypt.hash(user.password, 8);
    const newuser = await User.create({...user, password: hash});
    const role = newuser.role;
    if (role == 'customer') {
      await Customer.create({...info, user: newuser._id})
    }
    else if (role == 'vendor') {
      await Vendor.create({...info, user: newuser._id})
    }
    else if (role == 'shipper') {
      await Shipper.create({...info, user: newuser._id})
    }
  } catch (err) {
    throw(err)
  }
}

module.exports = {register_sample, register, login, getUserInfo, getUser_no_verify, changePassword}
