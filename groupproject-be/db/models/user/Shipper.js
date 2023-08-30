const mongoose = require('mongoose');
const Hub = require('../shopping/Hub');

const shipperSchema = new mongoose.Schema(
  {
    user: {
      type:mongoose.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    hub: {
      type:mongoose.Types.ObjectId, 
      ref: 'Hub',
      required: true
    }
  }
);

const Shipper = mongoose.model('Shipper', shipperSchema);
module.exports = Shipper;







