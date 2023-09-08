const express = require("express");
const path = require("path");
const { CONNECT_URI, PORT } = require("./common/constants");
const { default: mongoose } = require("mongoose");
const { navigatePage } = require("./common/helpers");
const products = require("./public/javascript/products");

require("dotenv").config();
const app = express();

async function connect() {
  try {
    await mongoose.connect(CONNECT_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// to apply css styles
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// reusable function for all ejs
app.locals.navigatePage = navigatePage;

// Modules
// const example = require('./modules/example.module.js');
// app.use('/', user)

// full route to Home page:
app.get("/", function (req, res) {
  res.render("layout.ejs", {
    title: "1080p Technology",
    products: products,
  });
});
// login and signup routes
app.get("/login", (req, res) => {
  res.render("others/login", {
    title: "Login",
  });
});

app.get("/signup", (req, res) => {
  res.render("others/signup", {
    title: "Sign Up",
  });
});
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
