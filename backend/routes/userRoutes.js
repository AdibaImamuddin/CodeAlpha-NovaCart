
import express from "express";
import {
  getAllCustomers,
  getCustomerById,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllCustomers
);

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getCustomerById
);

export default router;
