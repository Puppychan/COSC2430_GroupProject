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