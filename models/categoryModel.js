const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  id: {
    type: Number,
    // required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  modelId: {
    type: Number,
    // required: true,
  },
});

const categoryCollection = new mongoose.model("category", CategorySchema);
module.exports = categoryCollection;
