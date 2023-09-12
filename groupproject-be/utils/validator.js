const valid_username = function(str) {
  return (str.length >= 8 && str.length <= 15 && (/^[A-Za-z0-9]*$/.test(str)));
}

const valid_password = function(str) {
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

module.exports = {valid_username, valid_password}

