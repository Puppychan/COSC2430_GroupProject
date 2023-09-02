require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const {connectDB} = require("./db/connectDB");
const userRoutes = require("./routes/userRoutes");
const hubRoutes = require("./routes/hubRoutes");
const productRoutes = require("./routes/productRoutes");


app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.json());

// for testing 
app.set('view engine', 'ejs');

// support getting local image files
global.publicDirectory = path.resolve(__dirname, 'public');

connectDB()

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/user", userRoutes);
app.use("/api/hub", hubRoutes);
app.use("/api/product", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

