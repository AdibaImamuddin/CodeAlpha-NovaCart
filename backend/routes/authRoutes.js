
import express from "express";

import {
  registerUser,
  loginUser,
  verifyEmailOtp,
  changePassword,
} from "../controllers/authController.js";

import {
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyEmailOtp);
router.post("/login", loginUser);

// Customer profile routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Change password route
router.put("/change-password", authMiddleware, changePassword);

export default router;
