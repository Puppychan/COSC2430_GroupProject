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
const fs = require('fs');
const path = require('path');
const HttpStatus = require('../utils/commonHttpStatus')

// convert image to base64
const convertImageToBin = (req) => {
    try {
        // if image is not https or http
        if (!req.file) {
            return null;
        }
        // define image path + upload image to public folder
        const imagePath = path.join(global.publicDirectory, '/img/', req.file.filename);
        // convert image to base64
        const imageData = fs.readFileSync(imagePath);
        // render image content
        const imageContent = `data:image/${req.file.mimetype};base64,${imageData.toString('base64')}`
        // delete image file after render
        // use that path to delete file from public folder
        fs.unlink(imagePath, (err) => {
            if (err) {
                throw new Error(err);
            }
        });
        return imageContent;
    } catch (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE' || err.message === 'Field value too long') {
                throw new Error('File size too large', statusCode = HttpStatus.BAD_REQUEST_STATUS);
            }
            throw new Error(err.message, statusCode = HttpStatus.BAD_REQUEST_STATUS);
        }
        throw err;
    }
}
module.exports = { convertImageToBin };