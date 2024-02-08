const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    // enum: [1, 2, 3, 4], // user==>2, admin==1
    // default: 2, // Default role for new users
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
  },
});

const collection = new mongoose.model("users", UserSchema);
module.exports = collection;
