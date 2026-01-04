import express from "express";
import {
  getAllBookings,
  getAllUsers,
  getRevenueStats,
  updateStaffRole,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

// Routes only, no business logic here 🚀
router.get("/bookings", getAllBookings);
router.get("/users", getAllUsers);
router.get("/revenue", getRevenueStats);
router.patch("/users/:userId/role", updateStaffRole);
router.delete("/users/:userId", deleteUser);

export default router;
