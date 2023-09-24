const productController = require("../controller/productController");
const {Product} = require('../db/models/modelCollection')

const HttpStatus = require("../utils/commonHttpStatus");
const { sendResponse } = require("../middleware/middleware");

const checkStock = async (productid, quantity) => {
    try {
        let product = await Product.findById(productid);
        
        if (product == null) throw new Error("No product found with given id");

        if (product.stock < quantity) return false;
        return true;
    }
    catch (err) {
        throw(err)
    }
}

const updateStock = async (productid, quantity) => {
    try {
        let product = await Product.findOneAndUpdate({_id: productid}, { $inc: { stock: quantity}}, {new: true});
        if (product == null) throw new Error("No product found with given id");
        return product;
    }
    catch (err) {
        throw(err)
    }
}

const getProducts = async (req) => {
    try {
        const productList = await productController.getProducts(req);
        return sendResponse(HttpStatus.OK_STATUS, `Get products successfully`, productList);
    }
    catch (err) {
        console.log(err);
        return sendResponse(err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS, err.message ?? `Get products failed`);
    }
};

const getRandomProducts = async (req) => {
    try {
        const productList = await productController.getRandomProducts(req);
        return sendResponse(HttpStatus.OK_STATUS, `Get products successfully`, productList);
    }
    catch (err) {
        console.log(err);
        return sendResponse(err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS, err.message ?? `Get products failed`);
    }
};

const getProductById = async (req) => {
    try {
        const product = await productController.getProductById(req);
        if (!product) {
            return sendResponse(HttpStatus.NOT_FOUND_STATUS, `Product Not Found`);
        }
        return sendResponse(HttpStatus.OK_STATUS, `Get product successfully`, product);

    } catch (err) {
        console.log(err);
        return sendResponse(err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS, err.message ?? `Get products failed`);
    }
};

const getProductByObjectId = async (req) => {
    try {
        const product = await productController.getProductByObjectId(req);
        if (!product) {
            return sendResponse(HttpStatus.NOT_FOUND_STATUS, `Product Not Found`);
        }
        return sendResponse(HttpStatus.OK_STATUS, `Get product successfully`, product);

    } catch (err) {
        console.log(err);
        return sendResponse(err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS, err.message ?? `Get products failed`);
    }
};

const createProduct = async (req) => {
    try {
        const product = await productController.createProduct(req);
        return sendResponse(HttpStatus.OK_STATUS, `Create product successfully`, product);
    } catch (err) {
        console.log(err);
        return sendResponse(err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS, err.message ?? `Create products failed`);
    }
};
const updateProduct = async (req) => {
    try {
        const product = await productController.updateProduct(req);
        if (!product) {
            return sendResponse(HttpStatus.NOT_FOUND_STATUS, `Product Not Found`);
        }
        return sendResponse(HttpStatus.OK_STATUS, `Update product successfully`, product);
    } catch (err) {
        console.log(err);
        return sendResponse(err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS, err.message ?? `Update products failed`);
    }
};
const deleteProduct = async (req) => {
    try {
        const product = await productController.deleteProductById(req);
        if (!product) {
            return sendResponse(HttpStatus.NOT_FOUND_STATUS, `Product Not Found`);
        }
        return sendResponse(HttpStatus.OK_STATUS, `Delete product successfully`, product);
    } catch (err) {
        console.log(err);
        return sendResponse(err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS, err.message ?? `Delete products failed`);
    }
}
module.exports = { checkStock, updateStock, getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductByObjectId, getRandomProducts };