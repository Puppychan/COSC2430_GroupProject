require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const {connectDB} = require("./db/connectDB");
const userRoutes = require("./routes/userRoutes");
const hubRoutes = require("./routes/hubRoutes");
const productRoutes = require("./routes/productRoutes");

const mongoUrl =
"mongodb+srv://s3877707:cosc2430group@groupwebprogramming.fnigakp.mongodb.net/test?retryWrites=true&w=majority"

app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.json());

connectDB()

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/user", userRoutes);
app.use("/api/hub", hubRoutes);
app.use("/api/product", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

