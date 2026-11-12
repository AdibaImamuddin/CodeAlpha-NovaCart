
import express from "express";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: Get all categories
router.get("/", getCategories);

// Admin only: Add category
router.post("/", authMiddleware, adminMiddleware, addCategory);

// Admin only: Update category
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);

// Admin only: Delete category
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;
