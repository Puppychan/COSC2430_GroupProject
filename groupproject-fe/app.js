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
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./backend/db/connectDB");
const UserService = require("./backend/db_service/userService");
const ProductService = require("./backend/db_service/productService");
const CartService = require("./backend/db_service/cartService");
const OrderService = require("./backend/db_service/orderService");
const HttpStatus = require('./backend/utils/commonHttpStatus')
const multer = require('multer');
const HubService = require("./backend/db_service/hubService");

const { PORT, BACKEND_URL } = require("./common/constants");
const { navigatePage, formatCurrency, formatDate } = require("./common/helperFuncs");
const middleware = require("./backend/middleware/middleware");
const imageMulter = require("./backend/db/defineMulter");
const { Product } = require("./backend/db/models/modelCollection");
const { products } = require("./public/javascript/products");
const dummyOrders = require("./public/javascript/orders");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "auth-layout");

app.use(express.urlencoded({ extended: true }));
// to apply css styles
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


// reusable function for all ejs
app.locals.navigatePage = navigatePage;
app.locals.formatCurrency = formatCurrency;
// support getting local image files
global.publicDirectory = path.resolve(__dirname, 'public');

connectDB().catch((error) => {
  console.log(error);
});


// Home page route:
app.get("/", async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // get random products
    const renderedProductList = await ProductService.getRandomProducts(req);

    if (renderedProductList.status == HttpStatus.OK_STATUS) { // rendered products successfully
      res.render("layout.ejs", {
        title: "Home",
        bodyFile: "./home/index",
        activePage: "home",
        isLogin: isLogin,
        userRole: isLogin ? userRole : null,
        products: renderedProductList.data,
      });
    } else {
      middleware.sendInvalidResponse(res, renderedProductList);
      console.log(result);
    }
  } catch (err) {
    console.log(err);
    middleware.sendThrowErrorResponse(res, err);
  }
});

// View All Products route:
app.get("/viewAll", async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();

    // get products with pagination, search, filter
    const results = await ProductService.getProducts(req);

    if (results.status == HttpStatus.OK_STATUS) {  // rendered products successfully
      // get products and page info
      const products = results?.data?.data;
      // get page info - minPrice - maxPrice - search, pagination
      const pageInfo = {
        page: parseInt(results?.data?.page), // current page
        offset: results?.data?.offset, // which position of first item in page
        totalPage: parseInt(results?.data?.totalPage), // total number pages
        minPrice: results?.data?.minPrice, // min price
        maxPrice: results?.data?.maxPrice, // max price
        search: results?.data?.search, // search keyword
      };
      // render viewAll page
      res.render("layout.ejs", {
        title: "Explore All Products",
        bodyFile: "./product/productList",
        products: products,
        pageInfo: pageInfo,
        userRole: isLogin ? userRole : null,
        isLogin: isLogin,
        activePage: "products",
      });
    } else {
      console.log(results);
      // if get products failed
      middleware.sendInvalidResponse(res, results);
    }
  } catch (err) {
    console.log(err);
    middleware.sendThrowErrorResponse(res, err);
  }
});

// login routes
app.get("/login", async (req, res) => {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    // if have login
    if (isLogin) {
      res.redirect("/my-account");
    }
    // if not login
    else {
      res.render("auth-layout.ejs", {
        title: "Login",
        bodyFile: "./auth/login",
        activePage: "login",
      });
    }
  } catch (err) {
    console.log(err);
    // if failed to render login page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.post("/login", async (req, res) => {
  try {
    // get username and password from request body
    const { username, password } = req.body;
    // use that username and password to login
    const result = await UserService.login(username, password);
    // if login successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // set token and user role to local storage
      middleware.setToken(result.data.token);
      middleware.setUserRoleLocal(result.data.role);
      // redirect to home page
      res.redirect("/");
    } else if (result.status == HttpStatus.UNAUTHORIZED_STATUS || result.status == HttpStatus.BAD_REQUEST_STATUS) {
      // if login failed due to wrong username or password
      console.log(result);
      // redirect to login page
      res.redirect("/login");
    } else {
      // if login failed due to other reasons
      console.log(result);
      // redirect to error page
      middleware.sendInvalidResponse(res, result);
    }
  } catch (err) {
    console.log(err);
    // if failed to login
    middleware.sendThrowErrorResponse(res, err);
  }
});

// logout
app.get("/logout", async (req, res) => {
  try {
    // logout - remove token and user role from local storage
    middleware.logout();
    // redirect to home page
    res.redirect("/login");
  } catch (err) {
    // if failed to logout
    console.log(err);
  }
});

// My Account route
app.get("/my-account", middleware.verifyUser, async (req, res) => {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // get user info
    const userId = req.user._id;
    const result = await UserService.getUserInfo(userId);
    // if get user info successfully
    if (result.status == HttpStatus.OK_STATUS) {
      res.render("layout.ejs", {
        title: "My Account",
        bodyFile: "./users/profile",
        activePage: "my-account",
        isLogin: isLogin,
        userRole: userRole,
        user: result.data.user_data,
      });
    } else {
      // if get user info failed
      console.log(result);
      middleware.sendInvalidResponse(res, result);
    }
  } catch (err) {
    console.log(err);
    // if failed to render my account page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.post("/my-account", middleware.verifyUser, imageMulter.single('avatar'), async (req, res) => {
  try {
    // update user profile
    const result = await UserService.updateProfile(req.user._id, req);
    console.log("Update profile", result);
    // if update successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to my account page
      res.redirect("/my-account");
    } else {
      console.log(result);
      // if update failed
      // redirect to error page
      middleware.sendInvalidResponse(res, result);
    }
  } catch (err) {
    console.log(err);
    // if failed to update profile
    middleware.sendThrowErrorResponse(res, err);
  }
});

// Change password route
app.get("/change-password", middleware.verifyUser, async (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // get user info
    const result = await UserService.getUserInfo(req.user._id);
    // if get user info successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // render change password page
      let user_data = result.data.user_data;
      res.render("layout.ejs", {
        title: "Change Password",
        bodyFile: "./users/change-password",
        activePage: "change-password",
        isLogin: isLogin,
        userRole: isLogin ? userRole : null,
        user: user_data,
      });
    } else {
      // if get user info failed
      console.log(result);
      // redirect to error page
      middleware.sendInvalidResponse(res, result);
    }
  } catch (err) {
    console.log(err);
    // if failed to render change password page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.post("/change-password", middleware.verifyUser, async (req, res) => {
  try {
    // change password
    const result = await UserService.changePassword(
      req,
      req.body.current_pw,
      req.body.new_pw
    );
    // if change password successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to logout
      res.redirect("/logout");
    } else {
      // if change password failed
      console.log(result);
      res.redirect("/change-password");
    }
  } catch (err) {
    console.log(err);
    // if failed to change password
    middleware.sendThrowErrorResponse(res, err);
  }
});

// Customer signup routes
app.get("/signup-customer", (req, res) => {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    if (isLogin) {
      // if have login -> redirect to my account page
      res.redirect("/my-account");
    }
    else {
      // if not login -> render signup page
      res.render("auth-layout.ejs", {
        title: " Customer Sign Up",
        bodyFile: "./auth/signup-customer",
        activePage: "signup-customer",
      });
    }
  } catch (err) {
    console.log(err);
    // if failed to render signup page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.post("/signup-customer", imageMulter.single('avatar'), async (req, res) => {
  try {
    // register customer
    const result = await UserService.register(req);
    // if register successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to login page
      res.redirect("/login");
    } else {
      // if register failed
      console.log(result);
      res.redirect("/signup-customer");
    }
  } catch (err) {
    console.log(err);
    // if failed to register
    middleware.sendThrowErrorResponse(res, err);
  }
});
// Vendor signup routes
app.get("/signup-vendor", (req, res) => {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    if (isLogin) {
      // if have login -> redirect to my account page
      res.redirect("/my-account");
    }
    else {
      // if not login -> render signup page
      res.render("auth-layout.ejs", {
        title: "Vendor Sign Up",
        bodyFile: "./auth/signup-vendor",
        activePage: "signup-vendor",
      });
    }
  } catch (err) {
    console.log(err);
    // if failed to render signup page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.post("/signup-vendor", imageMulter.single('avatar'), async (req, res) => {
  try {
    // register vendor
    const result = await UserService.register(req);
    // if register successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to login page
      res.redirect("/login");
    } else {
      // if register failed
      console.log(result);
      res.redirect("/signup-vendor");
    }
  } catch (err) {
    console.log(err);
    // if failed to register
    middleware.sendThrowErrorResponse(res, err);
  }
});

// Shipper signup routes
app.get("/signup-shipper", (req, res) => {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    // if have login
    if (isLogin) {
      res.redirect("/my-account");
    }
    // if not login
    else {
      res.render("auth-layout.ejs", {
        title: "Shipper Sign Up",
        bodyFile: "./auth/signup-shipper",
        activePage: "signup-shipper",
      });
    }
  } catch (err) {
    console.log(err);
    // if failed to render signup page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.post("/signup-shipper", imageMulter.single('avatar'), async (req, res) => {
  try {
    // register shipper
    const result = await UserService.register(req);
    // if register successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to login page
      res.redirect("/login");
    } else {
      // if register failed
      console.log(result);
      res.redirect("/signup-shipper");
    }
  } catch (err) {
    console.log(err);
    // if failed to register
    middleware.sendThrowErrorResponse(res, err);
  }
});
// full route to footer pages:
app.get("/about", async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // render about page
    res.render("layout.ejs", {
      title: "About Us",
      bodyFile: "./others/about",
      isLogin: isLogin,
      activePage: "about",
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
    // if failed to render about page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.get("/copyright", async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // render copyright page
    res.render("layout.ejs", {
      title: "Copyright",
      bodyFile: "./others/copyright",
      isLogin: isLogin,
      activePage: "about",
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
    // if failed to render copyrights page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.get('/privacy', async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // render privacy page
    res.render("layout.ejs", {
      title: "Privacy",
      bodyFile: "./others/privacy",
      isLogin: isLogin,
      activePage: "about",
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
    // if failed to render privacy page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.get('/terms', async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // render terms page
    res.render("layout.ejs", {
      title: "Terms",
      bodyFile: "./others/terms",
      isLogin: isLogin,
      activePage: "about",
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
    // if failed to render terms page
    middleware.sendThrowErrorResponse(res, err);
  }
});

// New Product route
app.get("/new-product", middleware.verifyUser, async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    if (userRole != "vendor") {
      // if not vendor -> redirect to error page
      middleware.sendInvalidResponse(res, HttpStatus.FORBIDDEN_STATUS);
    }
    // render new product page
    res.render("layout.ejs", {
      title: "New Product",
      bodyFile: "./vendors/addProduct",
      activePage: "add-product",
      isLogin: isLogin,
      userRole: isLogin ? userRole : null,
      userId: req.user._id,
    });
  } catch (err) {
    console.log(err);
    // if failed to render new product page
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.post("/new-product", middleware.verifyUser, imageMulter.single('image'), async function (req, res) {
  try {
    // get product by id to display on update page
    const newProduct = await ProductService.createProduct(req);

    // if create product successfully
    if (newProduct.status == HttpStatus.OK_STATUS) {
      // redirect to product detail page
      res.redirect("/product/" + newProduct.data._id);
    } else {
      // if create product failed
      console.log("Bug", newProduct);
      // redirect to error page
      middleware.sendInvalidResponse(res, newProduct);
    }
  } catch (err) {
    console.log(err);
  }
});

// Product page route:
app.get("/product/:id", async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // get product info by id
    const productResult = await ProductService.getProductById(req);
    // if get product successfully
    if (productResult.status == HttpStatus.OK_STATUS) {
      // render product detail page
      res.render("layout.ejs", {
        title: "Product Detail",
        bodyFile: "./product/product",
        activePage: "product",
        isLogin: isLogin,
        product: productResult.data,
        userRole: isLogin ? userRole : null,
      });
    }
    else {
      // if get product failed
      console.log(productResult);
      // redirect to error page
      middleware.sendInvalidResponse(res, productResult);
    }
  } catch (err) {
    console.log(err);
    // if failed to render product detail page
    middleware.sendThrowErrorResponse(res, err);
  }
});

// Update Product Route
app.get("/update-product/:id", middleware.verifyUser, imageMulter.single('image'), async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();

    if (userRole != "vendor") {
      // if not vendor -> redirect to error page
      middleware.sendInvalidResponse(res, HttpStatus.FORBIDDEN_STATUS);
    }

    // get product by id to display on update page
    const productResult = await ProductService.getProductById(req);

    // if get product successfully
    if (productResult.status == HttpStatus.OK_STATUS) {
      // render update product page
      res.render("layout.ejs", {
        title: "Update Product",
        bodyFile: "./vendors/updateProduct",
        isLogin: isLogin,
        activePage: "updateProduct",
        product: productResult.data,
        userRole: isLogin ? userRole : null,
      });
    } else {
      console.log("Bug", productResult);
      // if get product failed
      // redirect to error page
      middleware.sendInvalidResponse(res, productResult);
    }
  } catch (err) {
    // if failed to render update product page
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

app.post("/update-product/:id", middleware.verifyUser, imageMulter.single('image'), async function (req, res) {
  try {
    // update product
    const result = await ProductService.updateProduct(req);
    // if update successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to product detail page
      res.redirect("/product/" + result.data._id);
    } else {
      // if update failed
      console.log(result);
      // redirect to error page
      middleware.sendInvalidResponse(res, result);
    }
  } catch (err) {
    console.log(err);
    // if failed to update product
    middleware.sendThrowErrorResponse(res, err);
  }
});

app.post("/delete-product/:id", middleware.verifyUser, async function (req, res) {
  try {
    // delete product
    const result = await ProductService.deleteProduct(req);
    // if delete successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to vendor dashboard
      res.redirect("/vendor-dashboard");
    } else {
      // if delete failed
      // redirect to error page
      middleware.sendInvalidResponse(res, result);
      console.log(result);
    }
  } catch (err) {
    console.log(err);
    // if failed to delete product
    middleware.sendThrowErrorResponse(res, err);
  }
});


// Vendor Dashboard route
app.get("/vendor-dashboard", middleware.verifyUser, async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // if not vendor
    if (userRole != "vendor") {
      // redirect to error page
      middleware.sendInvalidResponse(res, HttpStatus.FORBIDDEN_STATUS);
    }

    // get products by vendor id
    const productResults = await ProductService.getProductsByVendorId(req);
    // if get products successfully
    if (productResults.status == HttpStatus.OK_STATUS) {
      // get page info for pagination
      const pageInfo = {
        page: parseInt(productResults?.data?.page),
        offset: productResults?.data?.offset,
        totalPage: parseInt(productResults?.data?.totalPage),
      };
      // render vendor dashboard page
      res.render("layout.ejs", {
        title: "Vendor Dashboard",
        bodyFile: "./vendors/viewProducts",
        activePage: "vendor-dashboard",
        isLogin: isLogin,
        userRole: isLogin ? userRole : null,
        products: productResults.data.data,
        pageInfo: pageInfo,
      });
    } else {
      // if get products failed
      middleware.sendInvalidResponse(res, productResults);
      console.log(productResults);
    }
  } catch (err) {
    // if failed to render vendor dashboard page
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

// Shipper Dashboard route
app.get("/shipper-dashboard", middleware.verifyUser, async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // if not shipper
    if (userRole != "shipper") {
      // redirect to error page
      middleware.sendInvalidResponse(res, HttpStatus.FORBIDDEN_STATUS);
    }
    // get orders by shipper id
    const orders = await UserService.getShipperDashboard(req.user._id);
    // if get orders successfully
    if (orders.status == HttpStatus.OK_STATUS) {
      // render shipper dashboard page
      res.render("layout.ejs", {
        title: "Shipper Dashboard",
        bodyFile: "./orders/orderList",
        isLogin: isLogin,
        activePage: "shipper-dashboard",
        userRole: isLogin ? userRole : null,
        orders: orders.data,
        formatDate: formatDate,
      });
    } else {
      // if get orders failed
      middleware.sendInvalidResponse(res, orders);
      console.log(orders);
    }
  } catch (err) {
    // if failed to render shipper dashboard page
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

// Cart route
app.get("/cart", middleware.verifyUser, async (req, res) => {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // render cart
    const result = await CartService.getCart(req.user._id);
    let cart = { items: [], totalPrice: 0 };
    // if get cart successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // if cart is not empty
      cart = result.data.cart.length ? result.data.cart[0] : cart;
      // render cart page
      res.render("layout.ejs", {
        title: "Shopping Cart",
        bodyFile: "./orders/cart",
        activePage: "cart",
        isLogin: isLogin,
        userRole: isLogin ? userRole : null,
        cart: cart,
      });
    } else {
      // if get cart failed
      middleware.sendInvalidResponse(res, result);
      console.log(result);
    }
  } catch (err) {
    // if failed to render cart page
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

// Add Product to Cart
app.post('/cart', middleware.verifyUser, async (req, res) => {
  try {
    // add product to cart
    const result = await CartService.addProductToCart(req.user._id, req.body.id, req.body.quantity);
    // if add successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to cart page
      res.redirect('/cart');
    } else {
      // if add failed
      console.log(result);
      middleware.sendInvalidResponse(res, result);
    }
  } catch (err) {
    // if failed to add product to cart
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

// Update Product Quantity in Cart
app.post('/cart-update', middleware.verifyUser, async (req, res) => {
  try {
    // update product quantity in cart
    const result = await CartService.updateProductInCart(req.user._id, req.body.id, req.body.quantity);
    // if update successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to cart page
      res.redirect('/cart');
    } else {
      // if update failed
      console.log(result);
      middleware.sendInvalidResponse(res, result);
    }
  } catch (err) {
    // if failed to update product quantity in cart
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

// Delete Product from Cart
app.post('/cart-delete', middleware.verifyUser, async (req, res) => {
  try {
    // delete product from cart
    const result = await CartService.deleteProductInCart(req.user._id, req.body.id);
    // if delete successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to cart page
      res.redirect('/cart');
    } else {
      // if delete failed
      middleware.sendInvalidResponse(res, result);
      console.log(result);
    }
  } catch (err) {
    // if failed to delete product from cart
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

// Place Order route
app.post("/order/place", middleware.verifyUser, async (req, res) => {
  try {
    // place order
    // get hub id from request body
    const hub = req.body.hubid;
    // place order
    const result = await OrderService.placeOrder(req.user._id, hub);
    // if place order successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // get order
      let order = result.data.order;
      console.log(order);
      // redirect to order detail page
      res.redirect("/order-detail/" + order._id);
    } else {
      // if place order failed
      middleware.sendInvalidResponse(res, result);
      console.log(result);
    }
  } catch (err) {
    // if failed to place order
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

app.post("/order/update", middleware.verifyUser, async (req, res) => {
  try {
    // update order status
    // get status and order id from request body
    const status = req.body.status;
    const orderid = req.body.orderid;
    // update order status
    const result = await OrderService.updateOrderStatus(orderid, status);
    // if update successfully
    if (result.status == HttpStatus.OK_STATUS) {
      // redirect to order detail page
      res.redirect("/order-detail/" + orderid);
    } else {
      // if update failed
      middleware.sendInvalidResponse(res, result);
      console.log(result);
    }
  } catch (err) {
    // if failed to update order status
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

app.get("/order", middleware.verifyUser, async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // get user info, hubs and cart
    const [user, hubs, cartResult] = await Promise.all([
      UserService.getUserInfo(req.user._id),
      HubService.getHubs(),
      CartService.getCart(req.user._id)
    ]);

    console.log("Order summary", cartResult.data.cart[0], hubs.data);
    // if get user info, hubs and cart successfully
    if (cartResult.status == HttpStatus.OK_STATUS && cartResult?.data?.cart[0] && user.status == HttpStatus.OK_STATUS && hubs.status == HttpStatus.OK_STATUS) {
      // render order summary page
      res.render("layout.ejs", {
        title: "Order Summary",
        bodyFile: "./orders/order",
        activePage: "order",
        isLogin: isLogin,
        userRole: isLogin ? userRole : null,
        headerTitle: "Order Summary",
        headerDescription: "Check your items before finish your order",
        cart: cartResult.data.cart[0],
        customer: user.data.user_data,
        getHubs: true,
        hubs: hubs.data,

      });
    } else if (user.status != HttpStatus.OK_STATUS) {
      // if get user info
      middleware.sendInvalidResponse(res, cartResult);
      console.log(user);
    } else if (hubs.status != HttpStatus.OK_STATUS) {
      // if get hubs failed
      middleware.sendInvalidResponse(res, hubs);
      console.log(hubs);
    }
    else {
      // if get cart failed
      middleware.sendInvalidResponse(res, cartResult);
      console.log(cartResult);
    }
  } catch (err) {
    console.log(err);
    // if failed to render order summary page
    middleware.sendThrowErrorResponse(res, err);
  }
});
// Get Order History
app.get('/order-history', middleware.verifyUser, async (req, res) => {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // get order history
    const orders = await OrderService.getOrderHistory(req.user._id);
    console.log(orders.data);

    // if get order history successfully
    if (orders.status == HttpStatus.OK_STATUS) {
      // render order history page
      res.render('layout.ejs', {
        title: 'Order History',
        bodyFile: './orders/orderList',
        activePage: 'order-history',
        isLogin: isLogin,
        userRole: isLogin ? userRole : null,
        formatDate: formatDate,
        orders: orders.data,
      });
    } else {
      // if get order history failed
      middleware.sendInvalidResponse(res, orders);
      console.log(orders);
    }
  } catch (err) {
    // if failed to render order history page
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }
});

// Order Detail route
app.get("/order-detail/:id", middleware.verifyUser, async function (req, res) {
  try {
    // get order id from request params
    const orderid = req.params.id;
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    // get order details
    const orderDetails = await OrderService.getOrderDetails(orderid);
    // if get order details successfully
    if (orderDetails.status == HttpStatus.OK_STATUS) {
      // render order detail page
      res.render("layout.ejs", {
        title: "Order Detail",
        bodyFile: "./orders/order",
        activePage: "order detail",
        product: products,
        isLogin: isLogin,
        userRole: isLogin ? userRole : null,
        headerTitle: "Order Detail",
        backOrderHistory: true,
        cart: orderDetails.data,
        customer: orderDetails.data.customer,
        updateState: userRole == "shipper" && true,
        // updateState: true,
      });
    }
    else {
      // if get order details failed
      middleware.sendInvalidResponse(res, orderDetails);
      console.log(result);
    }
  } catch (err) {
    // if failed to render order detail page
    middleware.sendThrowErrorResponse(res, err);
    console.log(err);
  }

});

// handle error if append to url
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large' });
    } else if (error.message === 'Field value too long') {
      return res.status(400).json({ error: 'Field value too long' });
    }
    return res.status(400).json({ error: error.message });
  }
  next(error);
});


// Start the server
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});

