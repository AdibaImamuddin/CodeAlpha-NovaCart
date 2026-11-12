
import Category from "../models/Category.js";

// GET: All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch categories.",
      error: error.message,
    });
  }
};

// POST: Add Category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Category added successfully.",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to add category.",
      error: error.message,
    });
  }
};

// PUT: Update Category
export const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty.",
        });
      }

      const duplicate = await Category.findOne({
        name: trimmedName,
        _id: { $ne: category._id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Category name already exists.",
        });
      }

      category.name = trimmedName;
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update category.",
      error: error.message,
    });
  }
};

// DELETE: Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete category.",
      error: error.message,
    });
  }
};
