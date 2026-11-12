
import express from "express";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: View products
router.get("/", getProducts);

// Admin protected routes
router.post("/", authMiddleware, adminMiddleware, addProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
