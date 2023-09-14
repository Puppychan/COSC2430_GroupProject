const mongoose = require('mongoose');
const {valid_username} = require('../../../utils/validator')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, 
      required: true, 
      unique: true,
      validate: {
        validator: valid_username,
        message: props => `${props.value} is not a valid username!`
      }
    },
    password: {
      type: String, 
      required: true,
    },
    role: {
      type: String, 
      required: true,
      enum: {
        values: ['customer', 'vendor', 'shipper'],
        message: 'Role "{VALUE}" is not supported'
      },
      default: 'customer'
    },
    avatar: {
      type: String,
      default: 'https://img.myloview.com/stickers/default-avatar-profile-icon-vector-social-media-user-700-202768327.jpg'
    },
    
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;







