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
const bcrypt = require("bcrypt");
const {
  User,
  Customer,
  Vendor,
  Shipper,
  Cart,
} = require("../db/models/modelCollection");
const { checkPassword, newToken, convertTokenToId } = require("../utils/verification");
const { sendResponse } = require("../middleware/middleware");
const HttpStatus = require("../utils/commonHttpStatus");

/*  this function register user (in both User collection and role's collection) 
  - example of all_info for customer:
{
  username: "customer01",
  password: "User123@",
  role: "customer",
  avatar: "
  name: "Ha Khanh",
  address: "Customer"
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
    const { username, password, role, avatar, name, address, hubid } = all_info;

    const hash = await bcrypt.hash(password, 8);
    const newuser = await User.create({
      username: username,
      password: hash,
      role: role,
      avatar: avatar,
    });

    let info = null;
    if (role == "customer") {
      info = await Customer.create({
        user: newuser._id,
        name: name,
        address: address,
      });
      await Cart.create({ customer: newuser._id });
    } else if (role == "vendor") {
      info = await Vendor.create({
        user: newuser._id,
        name: name,
        address: address,
      });
    } else if (role == "shipper") {
      info = await Shipper.create({
        user: newuser._id,
        name: name,
        hub: hubid,
      });
    } else
      return sendResponse(
        HttpStatus.BAD_REQUEST_STATUS,
        "Register failed. Role can only be customer, vendor, shipper"
      );

    return sendResponse(HttpStatus.OK_STATUS, "Register successfully", { user_info: newuser, role_info: info });
  } catch (err) {
    if (err.include('E11000 duplicate key error'))
      return sendResponse(HttpStatus.FORBIDDEN_STATUS, `Register failed: this username has been used by another account.`);
    else
      return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Register failed: ${err}`);
  }
};

// login(sername, password) returns login status in the following format
// {status, message, token}
// where:
//  - status: true if login succeed, false if fail
//  - message: more details on the cause of such login status
//  - token: if login succeed -> return a token (the frontend should store token to localstorage)
const login = async (username, password) => {
  try {
    const user = await User.findOne({ username: username });
    if (!!!user) {
      return sendResponse(
        HttpStatus.BAD_REQUEST_STATUS,
        "Login failed. Username does not exist"
      );
    }

    const same = await checkPassword(password, user.password);
    if (same) {
      let token = newToken(user);
      return sendResponse(HttpStatus.OK_STATUS, "Login successfully", {
        token,
        role: user.role,
        id: user._id
      });
    }
    return sendResponse(
      HttpStatus.BAD_REQUEST_STATUS,
      "Login failed. Wrong password"
    );
  } catch (err) {
    return sendResponse(
      HttpStatus.INTERNAL_SERVER_ERROR_STATUS,
      `Login failed: ${err}`
    );
  }
}


// login(sername, password) returns login status in the following format
// {status, message, token}
// where:
//  - status: true if login succeed, false if fail
//  - message: more details on the cause of such login status 
//  - token: if login succeed -> return a token (the frontend should store token to localstorage)
const updateProfile = async (userid, update_info) => {
  try {
    const { username, avatar, name, address } = update_info

    let updated_user = await User.findOneAndUpdate(
      { _id: userid },
      {
        username: username,
        avatar: avatar
      },
      { new: true }
    )

    if (!!!updated_user) {
      return sendResponse(HttpStatus.NOT_FOUND_STATUS, "Not found user with given id");
    }

    let role = updated_user.role;
    let updated_role_info = null;

    if (role == 'customer') {
      updated_role_info = await Customer.findOneAndUpdate(
        { user: userid },
        {
          name: name,
          address: address
        },
        { new: true }
      )
    }
    else if (role == 'vendor') {
      updated_role_info = await Vendor.findOneAndUpdate(
        { user: userid },
        {
          name: name,
          address: address
        },
        { new: true }
      )
    }
    else if (role == 'shipper') {
      updated_role_info = await Shipper.findOneAndUpdate(
        { user: userid },
        {
          name: name
        },
        { new: true }
      )
    }

    if (!!!updated_role_info) {
      return sendResponse(HttpStatus.NOT_FOUND_STATUS, `Not found ${role} info with given id`);
    }

    return sendResponse(HttpStatus.OK_STATUS, "Updated profile successfully", { user_info: updated_user, role_info: updated_role_info });
  } catch (err) {
    if (err.include('E11000 duplicate key error'))
      return sendResponse(HttpStatus.FORBIDDEN_STATUS, `Update failed: this username has been used by another account.`);
    else
      return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Update failed: ${err}`);
  }
}

const getUserInfo = async (userid) => {
  try {
    let user = await User.findOne({ _id: userid })
    if (user == null) return sendResponse(HttpStatus.NOT_FOUND_STATUS, `Not found user with given id`);

    let user_data = null;

    if (user.role == "customer") {
      user_data = await Customer.findOne(
        { user: user._id },
        { _id: 0 }
      ).populate("user");
    } else if (user.role == "vendor") {
      user_data = await Vendor.findOne({ user: user._id }, { _id: 0 }).populate(
        "user"
      );
    } else if (user.role == "shipper") {
      user_data = await Shipper.findOne(
        { user: user._id },
        { _id: 0 }
      ).populate("user");
    }

    if (user_data == null)
      return sendResponse(HttpStatus.NOT_FOUND_STATUS, `Not found ${role} info with given id`);

    user_data.user.password = 0; // password is unrevealed
    return sendResponse(HttpStatus.OK_STATUS, "ok", { user_data });
  } catch (err) {
    return sendResponse(
      HttpStatus.INTERNAL_SERVER_ERROR_STATUS,
      `Cannot get user: ${err}`
    );
  }
};
const getUser_no_verify = async (userid) => {
  try {
    const user = await User.findOne({ _id: userid });
    var user_data = null;
    if (user != null) {
      const role = user.role;
      if (role == 'customer') {
        user_data = await Customer.findOne({ 'user': user._id }).populate('user');
      }
      else if (role == 'vendor') {
        user_data = await Vendor.findOne({ 'user': user._id }).populate('user');
      }
      else if (role == 'shipper') {
        user_data = await Shipper.findOne({ 'user': user._id }).populate('user');
      }
      user_data.user.password = 0; // password is unrevealed
    }
    return sendResponse(HttpStatus.OK_STATUS, "ok", { user_data });
  } catch (err) {
    console.log(`cannot get user with id ${id}: `, err)
    // sendResponse(res, 500, `Error ${err}`);
  }
};


// changePassword() returns change password status in the following format
// {status, message}
// where:
//  - status: true if login succeed, false if fail
//  - message: more details on the cause of such login status
const changePassword = async (req, current_pw, new_pw) => {
  try {
    var user = await User.findOne({ _id: req.user._id });
    const same = await checkPassword(current_pw, user.password);
    if (same) {
      const hash = await bcrypt.hash(new_pw, 8);
      user = await User.findByIdAndUpdate(user._id, { password: hash });
      return sendResponse(HttpStatus.OK_STATUS, "Password is updated");
    }

    return sendResponse(HttpStatus.FORBIDDEN_STATUS, "Current password is wrong");
  } catch (err) {
    return sendResponse(
      HttpStatus.INTERNAL_SERVER_ERROR_STATUS,
      `Update password failed: ${err}`
    );
  }
};

// dont care this function, it is used to import sample data
const register_sample = async (user_register) => {
  try {
    const { user, info } = user_register;
    const hash = await bcrypt.hash(user.password, 8);
    const newuser = await User.create({ ...user, password: hash });
    const role = newuser.role;
    if (role == "customer") {
      await Customer.create({ ...info, user: newuser._id });
      await Cart.create({ customer: newuser._id });
    } else if (role == "vendor") {
      await Vendor.create({ ...info, user: newuser._id });
    } else if (role == "shipper") {
      await Shipper.create({ ...info, user: newuser._id });
    }
  } catch (err) {
    throw err;
  }
};

module.exports = { register_sample, register, login, getUserInfo, updateProfile, changePassword, getUser_no_verify }
