const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Add a category
router.post("/", async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error: error.message });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

module.exports = router;
