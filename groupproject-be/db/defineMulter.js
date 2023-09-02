// https://stackoverflow.com/questions/69406342/how-to-upload-the-image-file-on-mongodb-atlas-using-multer-nodejs
const multer = require('multer');
// // const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
// // const crypto = require('crypto');
// // const path = require('path');

// // // Create storage engine
// // const storage = new GridFsStorage({
// //     url: process.env.MONGODB_URI,
// //     options: { useNewUrlParser: true, useUnifiedTopology: true },
// //     file: (req, file) => {
// //         return new Promise((resolve, reject) => {
// //             crypto.randomBytes(16, (err, buf) => {
// //                 if (err) {
// //                     return reject(err);
// //                 }
// //                 const filename = buf.toString('hex') + path.extname(file.originalname);
// //                 const fileInfo = {
// //                     filename: filename,
// //                     bucketName: 'uploads'
// //                 };
// //                 resolve(fileInfo);
// //             });
// //         });
// //     }
// // });

// // const upload = multer({
// //     storage,
// //     // fileFilter
// // });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now())
        cb(null, file.originalname)
    }
})
const upload = multer({ storage });

module.exports = upload;

