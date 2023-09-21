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
const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
});

const Hub = mongoose.model('Hub', hubSchema);
module.exports = Hub;