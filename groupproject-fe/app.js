const express = require("express");
const path = require("path");

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
    title: "1080p Technology",
    bodyFile: "./home/index",
  });
});
// login and signup routes
app.get("/login", (req, res) => {

  res.render("auth-layout.ejs", {
    title: "Login",
    bodyFile: "./auth/login",
  });
});

app.get("/signup", (req, res) => {

  res.render("auth-layout.ejs", {
    title: "Sign Up",
    bodyFile: "./auth/signup",
  });
});

// full route to About page:
app.get("/about", function (req, res) {
  res.render("layout.ejs", {
    title: "About Us",
    bodyFile: "./others/about",
  });
});

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
