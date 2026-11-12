
import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Customer routes
router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);

// Admin routes
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// Customer: Get one order
router.get("/:id", authMiddleware, getOrderById);

export default router;
