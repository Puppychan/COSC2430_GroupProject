const Product = require('../db/models/shopping/Product');
const { sendResponse } = require('../routes/middleware');
const { convertImageToBin } = require('../utils/imageToBin');

const getProducts = async (req, res) => {
    try {
        let results;
        // get params
        const maxPrice = parseFloat(req.query.maxp);
        const minPrice = parseFloat(req.query.minp);
        // get pagination
        const currentPage = req.query.page ?? 1;
        const limit = 15;
        const skipValue = (currentPage - 1) * limit;
        let totalItems = 0; // total count of products

        // aggregate pipeline
        const matchStage = {};
        // if params exist -> filter
        if (!isNaN(maxPrice) || !isNaN(minPrice)) {
            // filter product by price range
            matchStage.price = { $gte: minPrice, $lte: maxPrice };
        }

        const agg = [
            { $match: matchStage },
            {
                $facet: {
                    totalRecords: [
                        { $count: "total" }
                    ],
                    data: [
                        { $skip: skipValue },
                        { $limit: limit }
                    ]
                }
            }
        ];
        results = await Product.aggregate(agg);
        // send response
        totalItems = results[0].totalRecords;
        console.log("Data: ", results[0].data, "Total: ", totalItems);
        // if no product
        if (totalItems == 0) return {
            data: [],
            page: 1,
            offset: 0,
            totalPage: 1
        };
        // if have product
        else return {
            data: results[0].data,
            page: currentPage,
            offset: skipValue + 1,
            totalPage: Math.ceil(totalItems / limit)

        }
    } catch (err) {
        // send response
        throw err;

    }
}

const getProductById = async (req, res) => {
    try {
        const renderedProduct = await Product.findById(req.params.id);
        if (!renderedProduct) {
            // return res.status(404).send('Product not found');
            return null
        }
        // sendResponse(res, 200, 'ok', renderedProduct);
        return renderedProduct;

    } catch (err) {
        // send response
        throw err;
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
        // send response
        sendResponse(res, err.statusCode, err.message ?? `Error`);
    }
}


const createProduct = async (req, res) => {
    let newProduct;
    try {
        // convert image to base64
        const imageContent = convertImageToBin(req);

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
        // send response
        sendResponse(res, err.statusCode, err.message ?? `Error`);
    }
}
// TODO
const updateProduct = async (req, res) => {
    try {
        // update product by id
        // get image attribute and the rest attributes
        const { vendor, name, price, stock, oldImage, description, image } = req.body;
        // convert image to base64
        const imageContent = convertImageToBin(req);
        // update product
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            vendor, name, price, stock, description,
            // get path + filename of image + format extension
            image: imageContent ?? oldImage,
        });
        // if update product not found
        if (!updatedProduct) {
            return null;
        }
        // if found and succesfully updated
        else {
            return updatedProduct;
        }
    } catch (err) {
        // send response
        throw err;
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
        // send response
        sendResponse(res, err.statusCode, err.message ?? `Error`);
    }
}
const deleteProductListId = async (req, res) => {
    try {
        const idsToDelete = req.body.ids;
        const deleteProducts = await Product.deleteMany({ _id: { $in: idsToDelete } });
        sendResponse(res, '200', 'Products deleted successfully');
    } catch (err) {
        // send response
        sendResponse(res, err.statusCode, err.message ?? `Error`);
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