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

// full route to Home page:
app.get("/", function (req, res) {
  res.render("layout.ejs", {
    title: "Home",
    bodyFile: "./home/index",
    products: products,
  });
});
// login and signup routes
app.get("/login", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Login",
    bodyFile: "./auth/login",
  });
});

app.get("/signup-customer", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Sign Up",
    bodyFile: "./auth/signup-customer",
  });
});
app.get("/signup-vendor", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Vendor Sign Up",
    bodyFile: "./auth/signup-vendor",
  });
});
app.get("/signup-shipper", (req, res) => {
  res.render("auth-layout.ejs", {
    title: "Shipper Sign Up",
    bodyFile: "./auth/signup-shipper",
  });
});

// full route to footer pages:
app.get("/about", function (req, res) {
  res.render("layout.ejs", {
    title: "About Us",
    bodyFile: "./others/about",
  });
});

app.get("/copyright", function (req, res) {
  res.render("layout.ejs", {
    title: "Copyright",
    bodyFile: "./others/copyright",
  });
});
app.get("/privacy", function (req, res) {
  res.render("layout.ejs", {
    title: "Privacy Policy",
    bodyFile: "./others/privacy",
  });
});
app.get("/terms", function (req, res) {
  res.render("layout.ejs", {
    title: "Terms & Conditions",
    bodyFile: "./others/terms",
  });
});
// My Account routes
app.get("/my-account", function (req, res) {
  res.render("layout.ejs", {
    title: "My Account",
    bodyFile: "./users/profile",
  });
});
// Start the server
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
