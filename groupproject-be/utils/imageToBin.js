const fs = require('fs');
const path = require('path');

// convert image to base64
const convertImageToBin = (req) => {
    // define image path
    const imagePath = path.join(global.publicDirectory, '/uploads/', req.file.filename);
    // convert image to base64
    const imageData = fs.readFileSync(imagePath);
    // render image content
    const imageContent = `data:image/${req.file.mimetype};base64,${imageData.toString('base64')}`
    // delete image file after render
    // use that path to delete file from public folder
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        }
    });
    return imageContent;
}
module.exports = { convertImageToBin };