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
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT = {
  jwt: process.env.JWT_SECRET || '12345-67890-09876-54321',
  jwtExp: '100d',
}

const checkPassword = (password, passwordHash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        reject(err)
      }
      resolve(same)
    })
  })
}


const newToken = user => {
  return jwt.sign({ id: user._id }, JWT.jwt, {
    expiresIn: JWT.jwtExp,
  })
}

const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

module.exports = { checkPassword, newToken, verifyToken }
