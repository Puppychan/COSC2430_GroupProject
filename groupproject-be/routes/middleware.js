const User = require('../db/models/user/User')
const { verifyToken } = require('../utils/verification')

const sendResponse = (res, statusCode, msg, data) => {
  res.status(!!statusCode ? statusCode : 200).json({
    message: !!msg ? msg : 'ok',
    statusCode: statusCode ?? 500,
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
      const user = await User.findById(payload.id, { password: 0 })
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
