const Product = require('../db/models/shopping/Product');
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
        throw err;

    }
}

const getProductById = async (req, res) => {
    try {
        const renderedProduct = await Product.findById(req.params.id);
        if (!renderedProduct) {
            return null
        }
        return renderedProduct;

    } catch (err) {
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
            return [];
        }
        return products
    } catch (err) {
        throw err;
    }
}


const createProduct = async (req, res) => {
    let newProduct;
    try {
        // convert image to base64
        const imageContent = convertImageToBin(req);

        // get image attribute and the rest attributes
        const { vendor, name, price, stock, description, image } = req.body;

        // Create a new product
        newProduct = await Product.create({
            vendor, name, price, stock, description,
            // get path + filename of image + format extension
            image: imageContent,
        });
        return newProduct;

    } catch (err) {
        throw err;
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
        throw err;
    }
}

const deleteProductById = async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        // if delete product not found
        if (!deleteProduct) {
            return null;
        }
        // if found and succesfully deleted
        else {
            return deleteProduct;
        }
    } catch (err) {
        throw err;
    }
}
const deleteProductListId = async (req, res) => {
    try {
        const idsToDelete = req.body.ids;
        const deleteProducts = await Product.deleteMany({ _id: { $in: idsToDelete } });
        return deleteProducts;
    } catch (err) {
        throw err;
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