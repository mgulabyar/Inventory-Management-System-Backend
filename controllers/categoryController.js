const Category = require("../models/categoryModel");

// @desc    Create category (CREATE)
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ success: false, message: 'Category already exists' });

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  @desc    Get all categories (READ ALL)
// @route   GET /api/categories

