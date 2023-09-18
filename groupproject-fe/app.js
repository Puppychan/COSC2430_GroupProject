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

const products = require("./public/javascript/products");

const { PORT, BACKEND_URL } = require("./common/constants");
const { navigatePage } = require("./common/helperFuncs");
const middleware = require("./backend/middleware/middleware");
const productMulter = require("./backend/db/defineMulter");
const { Product } = require("./backend/db/models/modelCollection");

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
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// reusable function for all ejs
app.locals.navigatePage = navigatePage;
// support getting local image files
global.publicDirectory = path.resolve(__dirname, 'public');

connectDB().catch((error) => {
  console.log(error);
});

// Modules
// const example = require('./modules/example.module.js');
// app.use('/', user)
// const router = express.Router();


// Home page route:
app.get("/", async function (req, res) {
  // verify if is login
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const result = await UserService.getUserInfo(userId);
  if (result.status == 200) { // Login successfully
    let user_data = result.data.user_data;
    res.render("layout.ejs", {
      title: "Home",
      bodyFile: "./home/index",
      activePage: "home",
      isLogin: isLogin,
      products: products,
      user: user_data,
    });
  } else if (result.status == HttpStatus.UNAUTHORIZED_STATUS || result.status == HttpStatus.NOT_FOUND_STATUS) { // Not login
    res.render("layout.ejs", {
      title: "Home",
      bodyFile: "./home/index",
      activePage: "home",
      isLogin: isLogin,
      products: products,
      user: null,
    });
  } else {
    console.log(result);
  }
});


// Category page route:
app.get("/viewAll", async function (req, res) {
  // verify if is login
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const user = await UserService.getUserInfo(userId);

  // get products
  const results = await ProductService.getProducts(req);
  const products = results?.data?.data;
  const pageInfo = {
    page: parseInt(results?.data?.page),
    offset: results?.data?.offset,
    totalPage: parseInt(results?.data?.totalPage),
  };
  console.log("Productss", products);
  res.render("layout.ejs", {
    title: "Explore All Products",
    bodyFile: "./category/viewAll",
    products: products,
    pageInfo: pageInfo,
    user: user,
    isLogin: isLogin,
    activePage: "products",
  });
});

// login routes
app.get("/login", async (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Login",
    bodyFile: "./auth/login",
    activePage: "login",
    activePage: "login",
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await UserService.login(username, password);
  console.log("Login ;sdnkds", result);
  if (result.status == 200) {
    middleware.setToken(result.data.token);
    middleware.setUserIdLocal(result.data.id);
    res.redirect("/");
  } else {
    console.log(result);
    res.redirect("/login");
  }
});

// logout
app.get("/logout", async (req, res) => {
  middleware.logout();
  res.redirect("/login");
});

// My Account route
app.get("/my-account", middleware.verifyUser, async (req, res) => {
  const isLogin = middleware.isLogin();
  const result = await UserService.getUserInfo(req.user._id);
  if (result.status == 200) {
    let user_data = result.data.user_data;
    console.log(user_data);
    res.render("layout.ejs", {
      title: "My Account",
      bodyFile: "./users/profile",
      activePage: "my-account",
      isLogin: isLogin,
      user: user_data,
    });
  } else {
    console.log(result);
  }
});

app.post("/my-account", middleware.verifyUser, async (req, res) => {
  const isLogin = middleware.isLogin();
  console.log("Is Login ", isLogin);
  const result = await UserService.updateProfile(req.user._id, req.body);
  if (result.status == 200) {
    let user_data = result.data.user_data;
    console.log(user_data);
    res.redirect("/my-account");
  } else {
    console.log(result);
  }
});

// Change password route
app.get("/change-password", middleware.verifyUser, async (req, res) => {
  const isLogin = middleware.isLogin();
  const result = await UserService.getUserInfo(req.user._id);
  if (result.status == 200) {
    let user_data = result.data.user_data;
    res.render("layout.ejs", {
      title: "Change Password",
      bodyFile: "./users/change-password",
      activePage: "change-password",
      isLogin: isLogin,
      user: user_data,
    });
  } else {
    console.log(result);
  }
});
app.post("/change-password", middleware.verifyUser, async (req, res) => {
  const isLogin = middleware.isLogin();
  const result = await UserService.changePassword(
    req,
    req.body.current_pw,
    req.body.new_pw
  );
  if (result.status == 200) {
    res.redirect("/logout");
  } else {
    console.log(result);
    res.redirect("/change-password");
  }
});
// Customer signup routes
app.get("/signup-customer", (req, res) => {
  res.render("auth-layout.ejs", {
    title: " Customer Sign Up",
    title: " Customer Sign Up",
    bodyFile: "./auth/signup-customer",
    activePage: "signup-customer",
    activePage: "signup-customer",
  });
});

app.post("/signup-customer", async (req, res) => {
  const result = await UserService.register(req.body);
  console.log("User", result);
  if (result.status == 200) {
    res.redirect("/login");
  } else {
    console.log(result);
    res.redirect("/signup-customer");
  }
});
// Vendor signup routes
app.get("/signup-vendor", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Vendor Sign Up",
    bodyFile: "./auth/signup-vendor",
    activePage: "signup-vendor",
  });
});

app.post("/signup-vendor", async (req, res) => {
  const result = await UserService.register(req.body);
  console.log("User", result);
  if (result.status == 200) {
    res.redirect("/login");
  } else {
    console.log(result);
    res.redirect("/signup-vendor");
  }
});

// Shipper signup routes
app.get("/signup-shipper", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Shipper Sign Up",
    bodyFile: "./auth/signup-shipper",
    activePage: "signup-shipper",
  });
});

app.post("/signup-shipper", async (req, res) => {
  console.log(req.body);
  const result = await UserService.register(req.body);
  console.log("User", result);
  if (result.status == 200) {
    res.redirect("/login");
  } else {
    console.log(result);
    res.redirect("/signup-shipper");
  }
});
// full route to footer pages:
app.get("/about", async function (req, res) {
  // verify if is login
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const result = await UserService.getUserInfo(userId);
  if (result.status == 200) {
    // Login successfully
    let user_data = result.data.user_data;
    res.render("layout.ejs", {
      title: "About Us",
      bodyFile: "./others/about",
      isLogin: isLogin,
      activePage: "about",
      user: user_data,
    });
  } else if (result.status == HttpStatus.UNAUTHORIZED_STATUS || result.status == HttpStatus.NOT_FOUND_STATUS) { // Not login
    res.render("layout.ejs", {
      title: "About Us",
      bodyFile: "./others/about",
      isLogin: isLogin,
      activePage: "about",
      user: null,
    });
  } else {
    console.log(result);
  }
});

app.get("/copyright", async function (req, res) {
  // verify if is login
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const result = await UserService.getUserInfo(userId);
  if (result.status == 200) {
    // Login successfully
    let user_data = result.data.user_data;
    res.render("layout.ejs", {
      title: "Copyright",
      bodyFile: "./others/copyright",
      isLogin: isLogin,
      activePage: "about",
      user: user_data,
    });
  } else if (result.status == HttpStatus.UNAUTHORIZED_STATUS || result.status == HttpStatus.NOT_FOUND_STATUS) { // Not login
    res.render("layout.ejs", {
      title: "About Us",
      bodyFile: "./others/copyright",
      isLogin: isLogin,
      activePage: "about",
      user: null,
    });
  } else {
    console.log(result);
  }
});
app.get('/privacy', async function (req, res) {
  // verify if is login
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const result = await UserService.getUserInfo(userId);
  if (result.status == 200) {
    // Login successfully
    let user_data = result.data.user_data;
    res.render("layout.ejs", {
      title: "Privacy",
      bodyFile: "./others/privacy",
      isLogin: isLogin,
      activePage: "about",
      user: user_data,
    });
  } else if (result.status == HttpStatus.UNAUTHORIZED_STATUS || result.status == HttpStatus.NOT_FOUND_STATUS) { // Not login
    res.render("layout.ejs", {
      title: "Privacy",
      bodyFile: "./others/privacy",
      isLogin: isLogin,
      activePage: "about",
      user: null,
    });
  } else {
    console.log(result);
  }
});
app.get('/terms', async function (req, res) {
  // verify if is login
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const result = await UserService.getUserInfo(userId);
  if (result.status == 200) {
    // Login successfully
    let user_data = result.data.user_data;
    res.render("layout.ejs", {
      title: "Terms",
      bodyFile: "./others/terms",
      isLogin: isLogin,
      activePage: "about",
      user: user_data,
    });
  } else if (result.status == HttpStatus.UNAUTHORIZED_STATUS || result.status == HttpStatus.NOT_FOUND_STATUS) { // Not login
    res.render("layout.ejs", {
      title: "Terms",
      bodyFile: "./others/terms",
      isLogin: isLogin,
      activePage: "about",
      user: null,
    });
  } else {
    console.log(result);
  }
});

// New Product route
app.get("/new-product", middleware.verifyUser, async function (req, res) {
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const user = (await UserService.getUserInfo(userId)).data.user_data;

  res.render("layout.ejs", {
    title: "New Product",
    bodyFile: "./vendors/addProduct",
    activePage: "products",
    isLogin: isLogin,
    user: user,
  });
});

app.post("/new-product", middleware.verifyUser, productMulter.single('image'), async function (req, res) {
  // verify if is login
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const user = await UserService.getUserInfo(userId);

  // get product by id to display on update page
  const newProduct = await ProductService.createProduct(req);
  // console.log("Product", productResult);


  if (newProduct.status == HttpStatus.OK_STATUS) {
    res.render("layout.ejs", {
      title: "Update Product",
      bodyFile: "./vendors/updateProduct",
      isLogin: isLogin,
      activePage: "updateProduct",
      product: newProduct.data,
      user: user,
    });
  } else {
    console.log("Bug", newProduct);
  }
});

// Product page route:
app.get("/product/:id", async function (req, res) {
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const user = await UserService.getUserInfo(userId);

  const productResult = await ProductService.getProductById(req);
  if (productResult.status == HttpStatus.OK_STATUS) {
    res.render("layout.ejs", {
      title: "Product Detail",
      bodyFile: "./product/product",
      activePage: "product",
      isLogin: isLogin,
      product: productResult.data,
      user: user,
    });
  } else {
    console.log(productResult);
  }
});

// Update Product Route
app.get("/update-product/:id", middleware.verifyUser, productMulter.single('image'), async function (req, res) {
  // verify if is login
  const isLogin = middleware.isLogin();
  // get user id after login
  const userId = middleware.getUserIdLocal();
  const user = await UserService.getUserInfo(userId);

  // get product by id to display on update page
  const productResult = await ProductService.getProductById(req);
  // console.log("Product", productResult);

  if (productResult.status == HttpStatus.OK_STATUS) {
    res.render("layout.ejs", {
      title: "Update Product",
      bodyFile: "./vendors/updateProduct",
      isLogin: isLogin,
      activePage: "updateProduct",
      product: productResult.data,
      user: user,
    });
  } else {
    console.log("Bug", productResult);
  }
});

app.post("/update-product/:id", middleware.verifyUser, productMulter.single('image'), async function (req, res) {
  try {
    const result = await ProductService.updateProduct(req);
    if (result.status == HttpStatus.OK_STATUS) {
      res.redirect("/product/" + result.data._id);
    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE' || err.message === 'Field value too long') {
        // throw new Error('File size too large', statusCode = HttpStatus.BAD_REQUEST_STATUS);
        // TODO: handle alert
        console.log("Multer Limit File Size");
      }
      // TODO; handle older multer
      console.log("Multer Error");
      // throw new Error(err.message, statusCode = HttpStatus.BAD_REQUEST_STATUS);
    }
  }
});

app.post("/delete-product/:id", middleware.verifyUser, async function (req, res) {
  const result = await ProductService.deleteProduct(req);
  if (result.status == HttpStatus.OK_STATUS) {
    res.redirect("/vendor-dashboard");
  } else {
    console.log(result);
  }
});


// Vendor Dashboard route
app.get("/vendor-dashboard", function (req, res) {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "Vendor Dashboard",
    bodyFile: "./vendors/viewProducts",
    activePage: "vendor-dashboard",
    isLogin: isLogin,
    products: products,
  });
});

// Shipper Dashboard route
app.get("/shipper-dashboard", function (req, res) {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "Shipper Dashboard",
    bodyFile: "./shipper/dashboard",
    isLogin: isLogin,
    activePage: "shipper-dashboard",
  });
});

// Cart route
app.get("/cart", middleware.verifyUser, async (req, res) => {
  const isLogin = middleware.isLogin();
  const result = await CartService.getCart(req.user._id);

  const user = await UserService.getUserInfo(req.user._id);
  if (result.status == 200) {
    const cartItems = await result.data.cart.items.map(async (item) => {
      const product = await ProductService.getProductByObjectId(item.product);
      if (product.status == HttpStatus.OK_STATUS) {
        return {
          product: product.data,
          quantity: item.quantity,
        }
      } else {
        console.log(product);
      }
      });
      console.log("Cart items", cartItems);
    let cart = {
      _id: result.data.cart._id,
      customer: user,
      items: cartItems,
    };
    console.log(cart);
    // console.log("Cart products", cart.items[0].product.name);
    res.render("layout.ejs", {
      title: "Shopping Cart",
      bodyFile: "./customer/cart",
      activePage: "cart",
      isLogin: isLogin,
      user: user,
      cart,
    });
  } else {
    console.log(result);
  }
});

// Add Product to Cart
app.post('/cart', middleware.verifyUser, async (req, res) => {
  const id = req.body.id;
  console.log("Add to cart", req.body)
  const result = await CartService.addProductToCart(req.user._id, req.body.id, req.body.quantity);
  if (result.status == 200) {
    res.redirect('/cart');
  } else {
    console.log(result);
  }
});

// Place Order route
app.post("/order", middleware.verifyUser, async (req, res) => {
  const result = await OrderService.placeOrder(req.user._id);
  if (result.status == 200) {
    let order = result.data.order;
    console.log(order);
  } else {
    console.log(result);
  }
});

app.get("/order", middleware.verifyUser, async function (req, res) {
  const isLogin = middleware.isLogin;
  const result = await UserService.getUserInfo(req.user._id);
  if (result.status == 200) {
    res.render("layout.ejs", {
      title: "Shopping order",
      bodyFile: "./customer/order",
      activePage: "order",
      product: products,
      isLogin: isLogin,
    });
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
