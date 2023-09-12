const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  address: {type: String, required: true, unique: true},
});

const Hub = mongoose.model('Hub', hubSchema);
module.exports = Hub;