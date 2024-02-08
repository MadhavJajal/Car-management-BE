const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);


const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const connect = mongoose.connect("mongodb://localhost:27017/MyUserDB");

connect
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error(`Could not connect to MongoDB: ${err}`);
  });