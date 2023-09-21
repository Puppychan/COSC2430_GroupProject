// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Authors: Tran Mai Nhung - s3879954
//          Tran Nguyen Ha Khanh - s3877707
//          Nguyen Vinh Gia Bao - s3986287
//          Ton That Huu Luan - s3958304
//          Ho Van Khoa - s3997024
// Acknowledgement: 
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
router.put('/:id', [verifyUser], productMulter.single('image'), updateProduct);
// get
router.route("/").get(getProducts);
router.route("/search").get(searchProducts);
router.route("/:id").get(getProductById);
// delete
router.route("/").delete([verifyUser], deleteProductListId);
router.route("/:id").delete([verifyUser], deleteProductById);

module.exports = router;