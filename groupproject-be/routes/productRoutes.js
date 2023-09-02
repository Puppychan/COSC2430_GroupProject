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
const productMulter = require('../db/defineMulter');

// post
router.post('/', [verifyUser], productMulter.single('image'), createProduct);
// update
router.put('/', [verifyUser], updateProduct);
// get
router.route("/").get(getProducts);
router.route("/search").get(searchProducts);
router.route("/:id").get(getProductById);
// delete
router.route("/").delete([verifyUser], deleteProductListId);
router.route("/:id").delete([verifyUser], deleteProductById);

module.exports = router;