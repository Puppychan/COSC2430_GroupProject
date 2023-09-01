const Product = require('../db/models/shopping/Product');
const { sendResponse } = require('../routes/middleware');

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
        }
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

const searchProducts = async (req, res) => {
    try {
        console.log("Called");
        const search = req.query.name;
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

module.exports = {
    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
}