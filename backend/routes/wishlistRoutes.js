
import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get customer wishlist
router.get("/", authMiddleware, getWishlist);

// Add product to wishlist
router.post("/", authMiddleware, addToWishlist);

// Remove product from wishlist
router.delete("/:productId", authMiddleware, removeFromWishlist);

export default router;
