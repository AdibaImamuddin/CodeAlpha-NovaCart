
import express from "express";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all customer addresses
router.get("/", authMiddleware, getAddresses);

// Add new address
router.post("/", authMiddleware, addAddress);

// Update existing address
router.put("/:id", authMiddleware, updateAddress);

// Delete address
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
