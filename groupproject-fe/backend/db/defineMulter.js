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
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/')
    },
    filename: function (req, file, cb) {
        // filename: name + timestamp + extension
        cb(null, req.body.name + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }
});

const uploadLimits = {
    fileSize: 25 * 1024 * 1024,  // 25 MB
    fieldSize: 2 * 1024 * 1024  // 2 MB
};

const upload = multer({
    storage: storage,
    limits: uploadLimits
});

module.exports = upload;
