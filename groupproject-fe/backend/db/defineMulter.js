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
