const express = require('express');
const {
    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
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

module.exports = router;