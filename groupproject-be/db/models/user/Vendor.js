const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type:mongoose.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    business_name: {
      type: String, 
      required: true,
      unique: true,
      minLength: [5, '5 characters at least']
    },
    business_address: {
      type: String, 
      required: true,
      unique: true,
      minLength: [5, '5 characters at least']
    }
  }
);

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;







