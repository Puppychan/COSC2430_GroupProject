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
const User = require('../db/models/user/User')
const { verifyToken } = require('../utils/verification')
const HttpStatus = require('../utils/commonHttpStatus')

// Local storage keys
const TOKEN_KEY = '1080P_TOKEN'
const USERROLE_KEY = '1080P_USERROLE'

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token)
}

const setUserRoleLocal = (userRole) => {
  localStorage.setItem(USERROLE_KEY, userRole);
}

const getToken = () => {
  let token = localStorage.getItem(TOKEN_KEY)
  return token
}

const getUserRoleLocal = () => {
  let userRole = localStorage.getItem(USERROLE_KEY);
  return userRole;
}

const isLogin = () => {
  if (!!getToken()) {
    return true
  }
  return false
}

const logout = () => {
  localStorage.clear()
}


const sendResponse = (status, message, data) => {
  return { status: status ?? 200, message: message ?? 'ok', data: data ?? null }
}

const sendResponse2 = (res, status, message) => {
  return res.status(status).render('err-layout', {
    title: 'Error',
    bodyFile: 'others/error',
    error: {
      status: status,
      message: message,
      data: null,  // You can pass additional data here if needed
    },
  });
};

const sendInvalidResponse = (res, err) => {
  let status = err.status ?? HttpStatus.BAD_REQUEST_STATUS;
  let message = err.message ?? `Bad Request`;
  return res.status(status).render('err-layout', {
    title: 'Error',
    bodyFile: 'others/error',
    error: {
      status: status,
      message: message,
      data: null,  // You can pass additional data here if needed
    },
  });
};
const sendThrowErrorResponse = (res, err) => {
  let status = err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS;
  let message = err.message ?? `Internal Server Error`;
  return res.status(status).render('err-layout', {
    title: 'Error',
    bodyFile: 'others/error',
    error: {
      status: status,
      message: message,
      data: null,  // You can pass additional data here if needed
    },
  });
};

const runAsyncWrapper = (callback) => {
  return function (req, res, next) {
    callback(req, res, next)
      .catch(next)
  }
}

const verifyUser = async (req, res, next) => {
  try {
    let token = getToken()
    if (token == null || token === undefined) {
      // return sendResponse2(res, HttpStatus.UNAUTHORIZED_STATUS, 'You are not authorized');
      res.redirect('/login');
    }

    const payload = await verifyToken(token)
    if (payload) {
      const user = await User.findOne({ _id: payload.id });
      user.password = 0;
      req['user'] = user
      next()
    } else {
      return sendResponse2(res, HttpStatus.UNAUTHORIZED_STATUS, 'You are not authorized');
    }
  } catch (err) {
    return sendResponse2(res, HttpStatus.INTERNAL_SERVER_ERROR_STATUS, `Error ${err}`);
  }
}


const verifyAction = async (req, res, next) => {
  try {
    if (req.params.userid != req.user._id) {
      sendResponse2(res, 400, 'You are not authorized to do this action')
      return;
    }
    next();
  } catch (err) {
    console.log('Error ', err)
    sendResponse2(res, 500, `Error ${err}`);
  }
}


module.exports = {
  runAsyncWrapper,
  sendResponse,
  sendResponse2,
  sendInvalidResponse,
  sendThrowErrorResponse,
  verifyUser,
  verifyAction,
  setToken,
  getToken,
  setUserRoleLocal,
  getUserRoleLocal,
  isLogin,
  logout
}