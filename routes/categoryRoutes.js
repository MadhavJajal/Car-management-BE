const express = require("express");
const router = express.Router();
const categoryCollection = require("../models/categoryModel"); 

// Post API for category

router.post("/category", async (req, res) => {
  console.log("req:", req.body);
  let categoryName = req.body.categoryName;

  if (!categoryName) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  try {
    // Find the highest id in the existing categories
    const highestIdCategory = await categoryCollection
      .findOne()
      .sort({ id: -1 });
    const highestModelIdCategory = await categoryCollection
      .findOne()
      .sort({ modelId: -1 });

    let newCategoryId = 1; // Default id if no category exists
    let newModelId = 100001; // Default modelId if no category exists

    if (highestIdCategory) {
      newCategoryId = highestIdCategory.id + 1;
    }

    if (highestModelIdCategory) {
      newModelId = highestModelIdCategory.modelId + 1;
    }

    // Check if the category already exists in the database
    const existingCategory = await categoryCollection.findOne({ categoryName });

    if (existingCategory) {
      return res.status(400).json({
        error: "Category already exists.",
      });
    } else {
      let category = new categoryCollection({
        id: newCategoryId.toString(),
        categoryName: categoryName,
        modelId: newModelId.toString(),
      });

      await category.save();

      res.json({ message: "Category added" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get API for category

router.get("/categories-info", async function (req, res) {
  try {
    const categories = await categoryCollection.find()  ;
    res.send(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   GET api/category/:id
// @desc    Get Category by ID from Database
// @access  Public

router.get("/category/:id",  async function (req, res) {
  const { id } = req.params;
  const category = await categoryCollection.findOne({ id });

  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  } else res.json(category);
});

// @route   DELETE api/category/:id
// @desc    Delete a Category by its ID from the database
// @access  Private

router.delete(
  "/category/:id",
  async function (req, res) {
    const { id } = req.params;
    let count = await categoryCollection.countDocuments({ id });

    // If there are products associated with this category, send an error message back to client
    if (count > 1) {
      return res.status(409).json({
        message: `This category is currently linked to ${count} product(s)`,
      });
    }

    try {
      const deletedCategory = await categoryCollection.deleteOne({ id });
      if (deletedCategory.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "No category with that ID was found." });
      }
      res.json({ message: "Successfully deleted category." });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
