const mongoose = require('mongoose');

const shipperSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    name: {
      type: String, 
      required: true,
      minLength: [5, '5 characters at least']
    },
    hub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hub',
      required: true
    }
  }
);

const Shipper = mongoose.model('Shipper', shipperSchema);
module.exports = Shipper;







