const Product = require('../db/models/shopping/Product');
const { sendResponse } = require('../routes/middleware');
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');


let gfs;
const conn = mongoose.connection;
conn.once("open", function () {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const getProducts = async (req, res) => {
    try {
        let products;
        // get params
        const maxPrice = req.query.maxp;
        const minPrice = req.query.minp;
        // if params exist -> filter
        if (maxPrice || minPrice)
            // filter product by price range
            products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
        // if params not exist -> get all product
        else
            products = await Product.find();
        // send response
        // if no product
        if (products.length == 0) sendResponse(res, 400, 'Not Product To Display');
        // if have product
        else sendResponse(res, 200, `ok`, products);
    } catch (err) {
        // get error status code
        const statusCode = err.statusCode || 500;
        // get error message
        const message = err.message || `Error ${err}`;
        // send response
        sendResponse(res, statusCode, message);
    }
}

const getProductById = async (req, res) => {
    try {
        const renderedProduct = await Product.findById(req.params.id);
        if (!renderedProduct) {
            // return res.status(404).send('Product not found');
            sendResponse(res, 400, 'Product Not Found');
            return;
        }
        // sendResponse(res, 200, 'ok', renderedProduct);
        res.render('../view/product', { product: renderedProduct });

    } catch (err) {
        // get error status code
        const statusCode = err.statusCode || 500;
        // get error message
        const message = err.message || `Error ${err}`;
        // send response
        sendResponse(res, statusCode, message);
    }
}

const searchProducts = async (req, res) => {
    try {
        console.log("Called");
        const search = req.query.name;
        // search products by name containing, insensitive case
        const products = await Product.find({ name: { $regex: '.*' + search + '.*', $options: 'i' } })
        // if no product
        if (products.length == 0) {
            sendResponse(res, 400, 'Not Product To Display');
            return;
        }
        sendResponse(res, 200, `ok`, products);
    } catch (err) {
        // get error status code
        const statusCode = err.statusCode || 500;
        // get error message
        const message = err.message || `Error ${err}`;
        // send response
        sendResponse(res, statusCode, message);
    }
}


const createProduct = async (req, res) => {
    let newProduct;
    try {
        // define image path
        const imagePath = path.join(global.publicDirectory, '/uploads/', req.file.filename);
        // convert image to base64
        const imageData = fs.readFileSync(imagePath);
        // render image content
        const imageContent = `data:image/${req.file.mimetype};base64,${imageData.toString('base64')}`
        // delete image file
        // use that path to delete file from public folder
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });

        // get image attribute and the rest attributes
        const { image, ...restAttributes } = req.body;

        // Create a new product
        newProduct = await Product.create({
            ...restAttributes,
            // get path + filename of image + format extension
            image: imageContent,
        });
        sendResponse(res, 200, 'Product created successfully', newProduct);

    } catch (err) {
        // get error status code
        const statusCode = err.statusCode || 500;
        // get error message
        const message = err.message || `Error ${err}`;
        // send response
        sendResponse(res, statusCode, message);
    }
}
// TODO
const updateProduct = async (req, res) => {
    try {

    } catch (err) {

    }
}

const deleteProductById = async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        // if delete product not found
        if (!deleteProduct) {
            sendResponse(res, '404', 'Product to delete not found');
        }
        // if found and succesfully deleted
        else {
            sendResponse(res, '200', 'Product deleted successfully');
        }
    } catch (err) {
        // get error status code
        const statusCode = err.statusCode || 500;
        // get error message
        const message = err.message || `Error ${err}`;
        // send response
        sendResponse(res, statusCode, message);
    }
}
const deleteProductListId = async (req, res) => {
    try {
        const idsToDelete = req.body.ids;
        const deleteProducts = await Product.deleteMany({ _id: { $in: idsToDelete } });
        sendResponse(res, '200', 'Products deleted successfully');
    } catch (err) {
        // get error status code
        const statusCode = err.statusCode || 500;
        // get error message
        const message = err.message || `Error ${err}`;
        // send response
        sendResponse(res, statusCode, message);
    }
}


module.exports = {
    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProductById,
    deleteProductListId
}