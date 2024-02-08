const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const collection = require("../models/userModel");
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body.values;
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    console.log('Existing User Found', existingUser, collection);
    bcrypt.compare(password, existingUser.password, (err, response) => {
      if (response) {
        const token = jwt.sign(
          {
            email: existingUser.email,
          },
          "jwt-secret-key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        
        // We will check that if the employee is logging in via the role's route for his departemnt
        // if (existingUser.role) {
        //   return res.status(403).json({
        //     message: "Please make sure you are logging in as the right user.",
        //     success: false,
        //   });
        // }
        return res.status(200).json({
          message: "User Logged in Successfully",
          users: existingUser,
        });
      } else {
        return res.status(400).json({ message: "Password is Incorrect" });
      }

    });
  } else {
    return res
      .status(400)
      .json({ message: "User not exists. Please enter correct Email" });
  }
});

// Register route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, role, email, password } = req.body.values;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const newUser = new collection({
        firstName,
        lastName,
        role,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({
        message: "User successfully registered! Please Login",
        users: newUser,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
