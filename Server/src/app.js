const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodpartnerRoutes = require("./routes/foodpartner.routes");
const foodRoutes = require("./routes/food.routes");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/foodpartner", foodpartnerRoutes);
module.exports = app;
