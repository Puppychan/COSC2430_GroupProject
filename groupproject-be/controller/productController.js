const Product = require('../db/models/shopping/Product');
const { sendResponse } = require('../routes/middleware');
const { verifyUser } = require('./middleware')


const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
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

const getProductById = async (req, res) => {
    try {
        const renderedProduct = await Product.findById(req.params.id);
        sendResponse(res, 200, 'ok', renderedProduct);
    } catch (err) {
        // get error status code
        const statusCode = err.statusCode || 500;
        // get error message
        const message = err.message || `Error ${err}`;
        // send response
        sendResponse(res, statusCode, message);
    }
}

const filterProducts = async (req, res) => {
    try {
        const maxPrice = req.query.max;
        const minPrice = req.query.min;
        // filter product by price range
        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
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

const searchProducts = async (req, res) => {
    try {
        const search = req.query.search;
        // search products by name containing, insensitive case
        const products = await Product.find({ name: { $regex: '.*' + search + '.*', $options: 'i' } })
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


// TODO
const createProduct = async (req, res) => {
    try {
        // const { name, vendor, image, price, stock, description } = req.body;
        const product = await Product.create({ ...req.body })
    } catch (err) {
        // get error status code
        const statusCode = err.statusCode || 500;
        // get error message
        const message = err.message || `Error ${err}`;
        // send response
        sendResponse(res, statusCode, message);
    }
}

const updateProduct = async (req, res) => {
    try {

    } catch (err) {

    }
}

const deleteProduct = async (req, res) => {
    try {

    } catch (err) {
        
    }
}