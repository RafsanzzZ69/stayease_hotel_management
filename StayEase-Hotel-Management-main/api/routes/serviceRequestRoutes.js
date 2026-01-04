import express from "express";
import {
  createServiceRequest,
  getUserFoodOrders,
  getUserHousekeepingRequests,
} from "../controllers/serviceRequestController.js";

const router = express.Router();

// Create a new service request
router.post("/", createServiceRequest);

// Get all food orders of a specific user
router.post("/user/food-orders", getUserFoodOrders);

// Get all housekeeping requests of a specific user
router.post("/user/housekeeping-requests", getUserHousekeepingRequests);

export default router;
