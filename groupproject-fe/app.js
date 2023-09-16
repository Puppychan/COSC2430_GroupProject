const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./backend/db/connectDB");
const UserService = require("./backend/db_service/userService");
const CartService = require("./backend/db_service/cartService");
const OrderService = require("./backend/db_service/orderService");

const products = require("./public/javascript/products");

const { PORT, BACKEND_URL } = require("./common/constants");
const { navigatePage } = require("./common/helperFuncs");
const middleware = require("./backend/middleware/middleware");

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

connectDB().catch((error) => {
  console.log(error);
});

// Modules
// const example = require('./modules/example.module.js');
// app.use('/', user)
// const router = express.Router();


// Home page route:
app.get("/", middleware.verifyUser, async function (req, res) {
  const isLogin = middleware.isLogin();
  const result = await UserService.getUserInfo(req.user._id);
  if (result.status == 200) {
    let user_data = result.data.user_data;
    console.log(user_data);
    res.render("layout.ejs", {
      title: "Home",
      bodyFile: "./home/index",
      activePage: "my-account",
      isLogin: isLogin,
      products: products,
      user: user_data,
    });
  } else {
    console.log(result);
  }
});


// Category page route:
app.get("/viewAll", function (req, res) {
  const { pag } = req.query;
  // const result =
  /**
   * pageIndex: 1,2,3
   * data: productList
   * totalPage: 10
   */
  res.render("layout.ejs", {
    title: "Explore All Products",
    bodyFile: "./category/viewAll",
    products: products,
    isLogin: isLogin,
    activePage: "phones",
  });
});

// Product page route:
app.get("/product/:id", function (req, res) {
  const isLogin = middleware.isLogin();
  const id = req.params.id;
  const matchedProduct = products.find((product) => product._id == id);
  res.render("layout.ejs", {
    title: "Product Detail",
    bodyFile: "./product/product",
    activePage: "product",
    isLogin: isLogin,
    product: matchedProduct,
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
  if (result.status == 200) {
    middleware.setToken(result.data.token);
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
  const result = await UserService.updateProfile(req.user._id, req.body);
  if (result.status == 200) {
    let user_data = result.data.user_data;
    console.log(user_data);
    res.render("layout.ejs", {
      title: "My Account",
      bodyFile: "./users/profile",
      activePage: "my-account",
      user: user_data,
      isLogin: isLogin,
    });
  } else {
    console.log(result);
  }
});

// Change password route
app.get("/change-password", middleware.verifyUser, async (req, res) => {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "Change Password",
    bodyFile: "./users/change-password",
    activePage: "change-password",
    isLogin: isLogin,
  });
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
app.get("/about", function (req, res) {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "About Us",
    bodyFile: "./others/about",
    isLogin: isLogin,
    activePage: "about",
  });
});

app.get("/copyright", function (req, res) {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "Copyright",
    bodyFile: "./others/copyright",
    isLogin: isLogin,
    activePage: "about",
  });
});
app.get("/privacy", function (req, res) {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "Privacy Policy",
    bodyFile: "./others/privacy",
    isLogin: isLogin,
    activePage: "about",
  });
});
app.get("/terms", function (req, res) {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "Terms & Conditions",
    bodyFile: "./others/terms",
    isLogin: isLogin,
    activePage: "about",
  });
});

// New Product route
app.get("/new-product", function (req, res) {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "Add New Product",
    bodyFile: "./vendors/addProduct",
    isLogin: isLogin,
    activePage: "newProduct",
  });
});

// Update Product Route
app.get("/update-product", function (req, res) {
  const isLogin = middleware.isLogin();
  res.render("layout.ejs", {
    title: "Update Product",
    bodyFile: "./vendors/updateProduct",
    isLogin: isLogin,
    activePage: "updateProduct",
  });
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
  if (result.status == 200) {
    let cart = result.data.cart;
    console.log(cart);
    res.render("layout.ejs", {
      title: "Shopping Cart",
      bodyFile: "./customer/cart",
      activePage: "cart",
      isLogin: isLogin,
      product: products,
    });
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

// Start the server
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
