const User = require('../db/models/user/User')
const { verifyToken } = require('../utils/verification')
const HttpStatus = require('../utils/commonHttpStatus')

// Local storage keys
const TOKEN_KEY = '1080P_TOKEN'
const USERID_KEY = '1080P_USERID'

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token)
}

const setUserIdLocal = (userid) => {
  localStorage.setItem(USERID_KEY, userid);
}

const getToken = () => {
  let token = localStorage.getItem(TOKEN_KEY)
  return token
}

const getUserIdLocal = () => {
  let userId = localStorage.getItem(USERID_KEY);
  return userId;
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
  return {status: status ?? 200, message: message ?? 'ok', data: data ?? null}
}

const sendResponse2 = (res, status, message, data) => {
  res.status(status ?? 200).json({
    status: status ?? 200, message: message ?? 'ok', data: data ?? null
  });
}

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
      return sendResponse2(res, HttpStatus.UNAUTHORIZED_STATUS, 'You are not authorized');
    }

    const payload = await verifyToken(token)
    if (payload) {
      const user =  await User.findOne({_id: payload.id});
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
  verifyUser,
  verifyAction,
  setToken,
  getToken,
  getUserIdLocal,
  setUserIdLocal,
  isLogin,
  logout
}
