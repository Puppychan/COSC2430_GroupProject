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
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const { connectDB } = require("./db/connectDB");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const hubRoutes = require("./routes/hubRoutes");
const productRoutes = require("./routes/productRoutes");

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// for testing 
app.set('view engine', 'ejs');

// support getting local image files
global.publicDirectory = path.resolve(__dirname, 'public');

connectDB()
  .catch((error) => {
    console.log(error)
  });

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/hub", hubRoutes);
app.use("/api/product", productRoutes);

const PORT = process.env.TEST_BACKEND_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

