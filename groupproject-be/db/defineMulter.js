// https://stackoverflow.com/questions/69406342/how-to-upload-the-image-file-on-mongodb-atlas-using-multer-nodejs
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        // filename: name + timestamp + extension
        cb(null, req.body.name + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }
})
const upload = multer({ storage });

module.exports = upload;

