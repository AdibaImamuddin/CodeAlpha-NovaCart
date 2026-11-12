
import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
};

// Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      image: image || "",
      stock: Number(stock),
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product.",
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};
