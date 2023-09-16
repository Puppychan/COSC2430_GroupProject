const productController = require("../controller/productController");
const HttpStatus = require("../utils/commonHttpStatus");
const getProducts = async (req, res) => {
    try {
        const productList = await productController.getProducts();
        return { status: HttpStatus.OK_STATUS, message: "Get products successfully", data: productList };
    }
    catch (err) {
        console.log(err);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR_STATUS, message: `Get products failed: ${err}` };
    }
};
const getProductById = async (req, res) => {
    try {
        const product = await productController.getProductById(req.params.id);
        if (!product) {
            return { status: HttpStatus.NOT_FOUND_STATUS, message: "Product not found" };
        }
        return { status: HttpStatus.OK_STATUS, message: "Get product successfully", data: product };

    } catch (err) {
        console.log(err);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR_STATUS, message: `Get product failed: ${err}` };
    }
};

const searchProducts = async (req, res) => {
    try {
        const productList = await productController.searchProducts(req.query.name);
        if (productList.length == 0) {
            return { status: HttpStatus.NOT_FOUND_STATUS, message: "Product not found" };
        }
        return { status: HttpStatus.OK_STATUS, message: "Get products successfully", data: productList };
    } catch (err) {
        console.log(err);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR_STATUS, message: `Get products failed: ${err}` };

    }
};
const createProduct = async (req, res) => {
    try {
        const product = await productController.createProduct(req.body);
        return { status: HttpStatus.OK_STATUS, message: "Create product successfully", data: product };
    } catch (err) {
        console.log(err);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR_STATUS, message: `Create product failed: ${err}` };
    }
};
const updateProduct = async (req, res) => {
    try {
        const product = await productController.updateProduct(req.body);
        return { status: HttpStatus.OK_STATUS, message: "Update product successfully", data: product };
    } catch (err) {
        console.log(err);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR_STATUS, message: `Update product failed: ${err}` };
    }
};
const deleteProduct = async (req, res) => {
    try {
        const product = await productController.deleteProductById(req.params.id);
        return { status: HttpStatus.OK_STATUS, message: "Delete product successfully", data: product };
    } catch (err) {
        console.log(err);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR_STATUS, message: `Delete product failed: ${err}` };
    }
}
module.exports = { getProducts, getProductById, searchProducts, createProduct, updateProduct, deleteProduct };