require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {connectDB} = require("./db/connectDB");

const userRoutes = require("./routes/userRoutes");
const hubRoutes = require("./routes/hubRoutes");

connectDB()
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/user", userRoutes);
app.use("/api/hub", hubRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

