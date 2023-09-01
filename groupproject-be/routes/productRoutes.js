const express = require('express');
const {
    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProductById,
    deleteProductListId
} = require('../controller/productController');
const { verifyUser } = require('./middleware');
const router = express.Router();

// post

// update

// get
router.route("/").get(getProducts);
router.route("/search").get(searchProducts);
router.route("/:id").get(getProductById);
// delete
router.route("/").delete(deleteProductListId);
router.route("/:id").get(deleteProductById);

module.exports = router;