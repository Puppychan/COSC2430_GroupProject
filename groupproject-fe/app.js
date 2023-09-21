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

const { PORT, BACKEND_URL } = require("./common/constants");
const { navigatePage, formatCurrency } = require("./common/helperFuncs");
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
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// reusable function for all ejs
app.locals.navigatePage = navigatePage;
app.locals.formatCurrency = formatCurrency;
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
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
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
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});

// Category page route:
app.get("/viewAll", async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();

    // get products
    const results = await ProductService.getProducts(req);
    const products = results?.data?.data;
    const pageInfo = {
      page: parseInt(results?.data?.page),
      offset: results?.data?.offset,
      totalPage: parseInt(results?.data?.totalPage),
      minPrice: results?.data?.minPrice,
      maxPrice: results?.data?.maxPrice,
      search: results?.data?.search,
    };


    if (results.status == HttpStatus.OK_STATUS) {  // get user id after login

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
    }
  } catch (err) {
    console.log(err);
  }
});

// login routes
app.get("/login", async (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    if (isLogin) {
      res.redirect("/my-account");
    }
    else {
      res.render("auth-layout.ejs", {
        title: "Login",
        bodyFile: "./auth/login",
        activePage: "login",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await UserService.login(username, password);
    console.log("Login ;sdnkds", result);
    if (result.status == HttpStatus.OK_STATUS) {
      middleware.setToken(result.data.token);
      middleware.setUserRoleLocal(result.data.role);
      res.redirect("/");
    } else {
      console.log(result);
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
});

// logout
app.get("/logout", async (req, res) => {
  try {
    middleware.logout();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
});

// My Account route
app.get("/my-account", middleware.verifyUser, async (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    const userId = req.user._id;
    const result = await UserService.getUserInfo(userId);
    // if have login
    if (isLogin) {
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
        console.log(result);
      }
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/my-account", middleware.verifyUser, imageMulter.single('avatar'), async (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    console.log("Is Login ", isLogin);
    const result = await UserService.updateProfile(req.user._id, req);
    if (result.status == HttpStatus.OK_STATUS) {
      let user_data = result.data.user_data;
      console.log(user_data);
      res.redirect("/my-account");
    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});

// Change password route
app.get("/change-password", middleware.verifyUser, async (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    const result = await UserService.getUserInfo(req.user._id);
    if (result.status == HttpStatus) {
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
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/change-password", middleware.verifyUser, async (req, res) => {
  try {
    const result = await UserService.changePassword(
      req,
      req.body.current_pw,
      req.body.new_pw
    );
    if (result.status == HttpStatus.OK_STATUS) {
      res.redirect("/logout");
    } else {
      console.log(result);
      res.redirect("/change-password");
    }
  } catch (err) {
    console.log(err);
  }
});

// Customer signup routes
app.get("/signup-customer", (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    if (isLogin) {
      res.redirect("/my-account");
    }
    else {
      res.render("auth-layout.ejs", {
        title: " Customer Sign Up",
        bodyFile: "./auth/signup-customer",
        activePage: "signup-customer",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/signup-customer", imageMulter.single('avatar'), async (req, res) => {
  try {
    const result = await UserService.register(req);
    console.log("User", result);
    if (result.status == HttpStatus.OK_STATUS) {
      res.redirect("/login");
    } else {
      console.log(result);
      res.redirect("/signup-customer");
    }
  } catch (err) {
    console.log(err);
  }
});
// Vendor signup routes
app.get("/signup-vendor", (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    if (isLogin) {
      res.redirect("/my-account");
    }
    else {
      res.render("auth-layout.ejs", {
        title: "Vendor Sign Up",
        bodyFile: "./auth/signup-vendor",
        activePage: "signup-vendor",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/signup-vendor", imageMulter.single('avatar'), async (req, res) => {
  try {
    const result = await UserService.register(req);
    console.log("User", result);
    if (result.status == HttpStatus.OK_STATUS) {
      res.redirect("/login");
    } else {
      console.log(result);
      res.redirect("/signup-vendor");
    }
  } catch (err) {
    console.log(err);
  }
});

// Shipper signup routes
app.get("/signup-shipper", (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    if (isLogin) {
      res.redirect("/my-account");
    }
    else {
      res.render("auth-layout.ejs", {
        title: "Shipper Sign Up",
        bodyFile: "./auth/signup-shipper",
        activePage: "signup-shipper",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/signup-shipper", imageMulter.single('avatar'), async (req, res) => {
  try {
    console.log(req.body);
    const result = await UserService.register(req);
    console.log("User", result);
    if (result.status == HttpStatus.OK_STATUS) {
      res.redirect("/login");
    } else {
      console.log(result);
      res.redirect("/signup-shipper");
    }
  } catch (err) {
    console.log(err);
  }
});
// full route to footer pages:
app.get("/about", async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    res.render("layout.ejs", {
      title: "About Us",
      bodyFile: "./others/about",
      isLogin: isLogin,
      activePage: "about",
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/copyright", async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    res.render("layout.ejs", {
      title: "Copyright",
      bodyFile: "./others/copyright",
      isLogin: isLogin,
      activePage: "about",
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get('/privacy', async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    res.render("layout.ejs", {
      title: "Privacy",
      bodyFile: "./others/privacy",
      isLogin: isLogin,
      activePage: "about",
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get('/terms', async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    res.render("layout.ejs", {
      title: "Terms",
      bodyFile: "./others/terms",
      isLogin: isLogin,
      activePage: "about",
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
  }
});

// New Product route
app.get("/new-product", middleware.verifyUser, async function (req, res) {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    res.render("layout.ejs", {
      title: "New Product",
      bodyFile: "./vendors/addProduct",
      activePage: "products",
      isLogin: isLogin,
      userRole: isLogin ? userRole : null,
      userId: req.user._id,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/new-product", middleware.verifyUser, imageMulter.single('image'), async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();

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
        userRole: isLogin ? userRole : null,
        userId: req.user._id,
      });
    } else {
      console.log("Bug", newProduct);
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
    if (productResult.status == HttpStatus.OK_STATUS) {
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
      console.log(productResult);
    }
  } catch (err) {
    console.log(err);
  }
});

// Update Product Route
app.get("/update-product/:id", middleware.verifyUser, imageMulter.single('image'), async function (req, res) {
  try {
    // verify if is login
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();

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
        userRole: isLogin ? userRole : null,
      });
    } else {
      console.log("Bug", productResult);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/update-product/:id", middleware.verifyUser, imageMulter.single('image'), async function (req, res) {
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
  try {
    const result = await ProductService.deleteProduct(req);
    if (result.status == HttpStatus.OK_STATUS) {
      res.redirect("/vendor-dashboard");
    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});


// Vendor Dashboard route
app.get("/vendor-dashboard", function (req, res) {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();

    res.render("layout.ejs", {
      title: "Vendor Dashboard",
      bodyFile: "./vendors/viewProducts",
      activePage: "vendor-dashboard",
      isLogin: isLogin,
      userRole: isLogin ? userRole : null,
      products: products,
    });
  } catch (err) {
    console.log(err);
  }
});

// Shipper Dashboard route
app.get("/shipper-dashboard", function (req, res) {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    res.render("layout.ejs", {
      title: "Shipper Dashboard",
      bodyFile: "./orders/dashboard",
      isLogin: isLogin,
      activePage: "shipper-dashboard",
      userRole: isLogin ? userRole : null,
      orders: dummyOrders,
    });
  } catch (err) {
    console.log(err);
  }
});

// Cart route
app.get("/cart", middleware.verifyUser, async (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();

    const result = await CartService.getCart(req.user._id);
    if (result.status == HttpStatus.OK_STATUS) {
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
        userRole: isLogin ? userRole : null,
        cart,
      });
    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/order-detail", middleware.verifyUser, async function (req, res) {
  try {
    const isLogin = middleware.isLogin;
    const userRole = middleware.getUserRoleLocal();

    const user = await UserService.getUserInfo(req.user._id);
    if (user.status == HttpStatus.OK_STATUS) {
      let user_data = result.data.user_data;
      console.log(user_data);

      res.render("layout.ejs", {
        title: "Order Detail",
        bodyFile: "./customer/order-detail",
        activePage: "order detail",
        product: products,
        isLogin: isLogin,
        userRole: isLogin ? userRole : null,
        user: user_data,
      });
    } else {
      console.log(user);
    }
  } catch (err) {
    console.log(err);
  }
});

// Add Product to Cart
app.post('/cart', middleware.verifyUser, async (req, res) => {
  try {
    console.log("Add to cart", req.body)
    const result = await CartService.addProductToCart(req.user._id, req.body.id, req.body.quantity);
    if (result.status == HttpStatus.OK_STATUS) {
      res.redirect('/cart');
    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});

// Delete Product from Cart
app.post('/cart-delete', middleware.verifyUser, async (req, res) => {
  try {
    const result = await CartService.deleteProductInCart(req.user._id, req.body.id);
    if (result.status == HttpStatus.OK_STATUS) {
      res.redirect('/cart');
    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});

// Place Order route
app.post("/order", middleware.verifyUser, async (req, res) => {
  try {
    const result = await OrderService.placeOrder(req.user._id);
    if (result.status == HttpStatus.OK_STATUS) {
      let order = result.data.order;
      console.log(order);

    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/order", middleware.verifyUser, async function (req, res) {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();
    const user = await UserService.getUserInfo(req.user._id);

    res.render("layout.ejs", {
      title: "Order Summary",
      bodyFile: "./customer/order",
      activePage: "order",
      product: products,
      isLogin: isLogin,
      userRole: isLogin ? userRole : null,
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
});
// Get Order History
app.get('/order-history', middleware.verifyUser, async (req, res) => {
  try {
    const isLogin = middleware.isLogin();
    const userRole = middleware.getUserRoleLocal();

    res.render('layout.ejs', {
      title: 'Order History',
      bodyFile: './orders/dashboard',
      activePage: 'order-history',
      isLogin: isLogin,
      userRole: isLogin ? userRole : null,
    });
  } catch (err) {
    console.log(err);
  }
});

// Order Detail route
app.get("/order-detail", middleware.verifyUser, async function (req, res) {
  const isLogin = middleware.isLogin;
  const result = await UserService.getUserInfo(req.user._id);
  const userId = middleware.getUserIdLocal();
  const user = await UserService.getUserInfo(userId);
  if (result.status == 200) {
    let user_data = result.data.user_data;
    console.log(user_data);

    res.render("layout.ejs", {
      title: "Order Detail",
      bodyFile: "./customer/order-detail",
      activePage: "order detail",
      product: products,
      isLogin: isLogin,
      user: user_data,
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
