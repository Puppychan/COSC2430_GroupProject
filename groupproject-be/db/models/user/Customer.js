const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      unique: [true, 'This user has been added to Customer before']
    },
    name: {
      type: String, 
      required: true,
      minLength: [5, '5 characters at least']
    },
    address: {
      type: String, 
      required: true,
      minLength: [5, '5 characters at least']
    }
  }
);

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;







