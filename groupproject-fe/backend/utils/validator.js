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
const valid_username = function (str) {
  return (str.length >= 8 && str.length <= 15 && (/^[A-Za-z0-9]*$/.test(str)));
}

const valid_password = function (str) {
  if (str.length < 8 || str.length > 20)
    return false;
  // false if string NOT contain at least one upper case letter & one lower case letter & one digit & one special letter 
  if (!((/[A-Z]/.test(str)) && (/[a-z]/.test(str)) && (/[0-9]/.test(str)) && (/[!@#$%^&*]/.test(str))))
    return false
  // false if string contains other kind of character
  if (!(/^[A-Za-z0-9!@#$%^&*]*$/.test(str)))
    return false;
  return true;
}

module.exports = { valid_username, valid_password }

