const express = require("express");
const cors = require("cors");
const path = require('path');
const {connectDB} = require("./backend/db/connectDB");

const products = require("./public/javascript/products");

const { PORT, BACKEND_URL } = require("./common/constants");
const { navigatePage } = require("./common/helperFuncs");

require("dotenv").config();
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

connectDB()
.catch((error) => {
  console.log(error)
});

// Modules
// const example = require('./modules/example.module.js');
// app.use('/', user)
// const router = express.Router();

// Home page route:
app.get("/", async function (req, res) {
  res.render("layout.ejs", {
    title: "Home",
    bodyFile: "./home/index",
    products: products,
    activePage: "home",
  });
});
// Category page route:
app.get("/phones", function (req, res) {
  res.render("layout.ejs", {
    title: "Smartphones",
    bodyFile: "./category/phones",
    products: products,
    activePage: "phones",
  });
});

// Product page route:
app.get("/product/:id", function (req, res) {
  const id = req.params.id;
  const matchedProduct = products.find((product) => product._id == id);
  res.render("layout.ejs", {
    title: "Product Detail",
    bodyFile: "./product/product",
    activePage: "product",
    product: matchedProduct,
  });
});

// login routes
app.get("/login", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Login",
    bodyFile: "./auth/login",
    activePage: "login",
  });
});

// Signup routes
app.get("/signup-customer", (req, res) => {
  res.render("auth-layout.ejs", {
    title: " Customer Sign Up",
    bodyFile: "./auth/signup-customer",
    activePage: "signup-customer",
  });
});

app.get("/signup-vendor", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Vendor Sign Up",
    bodyFile: "./auth/signup-vendor",
    activePage: "signup-vendor",
  });
});
app.get("/signup-shipper", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Shipper Sign Up",
    bodyFile: "./auth/signup-shipper",
    activePage: "signup-shipper",
  });
});

// full route to footer pages:
app.get("/about", function (req, res) {
  res.render("layout.ejs", {
    title: "About Us",
    bodyFile: "./others/about",
    activePage: "about",
  });
});

app.get("/copyright", function (req, res) {
  res.render("layout.ejs", {
    title: "Copyright",
    bodyFile: "./others/copyright",
    activePage: "about",
  });
});
app.get("/privacy", function (req, res) {
  res.render("layout.ejs", {
    title: "Privacy Policy",
    bodyFile: "./others/privacy",
    activePage: "about",
  });
});
app.get("/terms", function (req, res) {
  res.render("layout.ejs", {
    title: "Terms & Conditions",
    bodyFile: "./others/terms",
    activePage: "about",
  });
});
// My Account route
app.get("/my-account", function (req, res) {
  res.render("layout.ejs", {
    title: "My Account",
    bodyFile: "./users/profile",
    activePage: "my-account",
  });
});
// New Product route
app.get("/new-product", function (req, res) {
  res.render("layout.ejs", {
    title: "Add New Product",
    bodyFile: "./vendors/addProduct",
    activePage: "newProduct",
  });
});

// Update Product Route
app.get("/update-product", function (req, res) {
  res.render("layout.ejs", {
    title: "Update Product",
    bodyFile: "./vendors/updateProduct",
    activePage: "updateProduct",
  });
});
// Vendor Dashboard route
app.get("/vendor-dashboard", function (req, res) {
  res.render("layout.ejs", {
    title: "Vendor Dashboard",
    bodyFile: "./vendors/viewProducts",
    activePage: "vendor-dashboard",
    products: products,
  });
});

// Shipper Dashboard route
app.get("/shipper-dashboard", function (req, res) {
  res.render("layout.ejs", {
    title: "Shipper Dashboard",
    bodyFile: "./shipper/dashboard",
    activePage: "shipper-dashboard",
  });
});

// Cart route
app.get("/cart", function (req, res) {
  res.render("layout.ejs", {
    title: "Shopping Cart",
    bodyFile: "./customer/cart",
    activePage: "cart",
    product: products,
  });
});

app.get("/order", function (req, res) {
  res.render("layout.ejs", {
    title: "Shopping order",
    bodyFile: "./customer/order",
    activePage: "order",
    product: products,
  });
});

// Start the server
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
