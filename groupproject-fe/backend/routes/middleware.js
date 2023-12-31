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

const sendResponse = (res, statusCode, msg, data) => {
  res.status(statusCode ?? 200).json({
    message: msg ?? 'ok',
    statusCode: statusCode ?? 200,
    data: data
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
    const { authorization } = req.headers
    if (!authorization || !authorization.startsWith('Bearer ')) {
      sendResponse(res, 400, 'You are not authorized');
      return
    }

    const payload = await verifyToken(authorization.split(' ')[1])
    console.log(payload)
    if (payload) {
      const user = await User.findOne({ _id: payload.id });
      user.password = 0;
      req['user'] = user
      next()
    } else {
      sendResponse(res, 400, 'You are not authorized');
      return
    }
  } catch (err) {
    console.log('Error ', err)
    sendResponse(res, 500, `Error ${err}`);
  }
}


const verifyAction = async (req, res, next) => {
  try {
    if (req.params.userid != req.user._id) {
      sendResponse(res, 400, 'You are not authorized to do this action')
      return;
    }
    next();
  } catch (err) {
    console.log('Error ', err)
    sendResponse(res, 500, `Error ${err}`);
  }
}


module.exports = {
  runAsyncWrapper,
  sendResponse,
  verifyUser,
  verifyAction
}
