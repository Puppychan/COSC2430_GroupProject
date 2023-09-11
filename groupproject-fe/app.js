const express = require("express");
const path = require("path");
const products = require("./public/javascript/products");

require("dotenv").config();
const { PORT, BACKEND_URL } = require("./common/constants");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "auth-layout");

app.use(express.urlencoded({ extended: true }));
// to apply css styles
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// reusable function for all ejs
// app.locals.navigatePage = navigatePage;

// Modules
// const example = require('./modules/example.module.js');
// app.use('/', user)
// const router = express.Router();

// Home page route:
app.get("/", function (req, res) {
  res.render("layout.ejs", {
    title: "Home",
    bodyFile: "./home/index",
    products: products,
    activePage: "home",
  });
});
// Product page route:
app.get("/detail", function (req, res) {
  res.render("layout.ejs", {
    title: "Product Details",
    bodyFile: "./detail/detail",
    activePage: "detail",
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
    activePage: "signup",
  });
});
app.get("/signup-vendor", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Vendor Sign Up",
    bodyFile: "./auth/signup-vendor",
    activePage: "signup",
  });
});
app.get("/signup-shipper", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Shipper Sign Up",
    bodyFile: "./auth/signup-shipper",
    activePage: "signup",
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
    activePage: "copyright",
  });
});
app.get("/privacy", function (req, res) {
  res.render("layout.ejs", {
    title: "Privacy Policy",
    bodyFile: "./others/privacy",
    activePage: "privacy",
  });
});
app.get("/terms", function (req, res) {
  res.render("layout.ejs", {
    title: "Terms & Conditions",
    bodyFile: "./others/terms",
    activePage: "terms",
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
    activePage: "new-product",
  });
});

// Update Product Route
app.get("/update-product", function (req, res) {
  res.render("layout.ejs", {
    title: "Update Product",
    bodyFile: "./vendors/updateProduct",
    activePage: "update-product",
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
// Start the server
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
