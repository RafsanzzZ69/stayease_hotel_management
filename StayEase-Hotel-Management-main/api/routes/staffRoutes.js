console.log("✅ staffRoutes.js loaded");

import express from "express";
import { getAllBookings } from "../controllers/staff/upcomingBookingsController.js";
import { assignRoom } from "../controllers/staff/assignroomController.js";
import { updateBookingStatus } from "../controllers/staff/updateBookingStatusController.js";
import { getFoodOrders , updateFoodOrderStatus } from "../controllers/staff/kitchenController.js";
import {getAssignedHousekeepingRequests , updateHousekeepingStatus} from "../controllers/staff/housekeepingController.js";

const router = express.Router();

// ✅ Route to fetch all bookings
router.get("/getAllBookings", getAllBookings);
// ✅ Route to fetch food orders
router.get("/kitchen/orders", getFoodOrders);

// ✅ Route to update food order status
router.patch("/kitchen/orders/:orderId/status", updateFoodOrderStatus);

// ✅ Route to update booking status
router.patch("/:bookingId/status", updateBookingStatus);
router.post("/bookings/:bookingId/assign-room", assignRoom);

// ✅ Route to fetch housekeeping requests assigned to a staff
router.get("/housekeeping/requests/:staffId", getAssignedHousekeepingRequests);

// ✅ Route to update housekeeping request status
router.patch("/housekeeping/requests/:requestId/status", updateHousekeepingStatus);


router.get("/test", (req, res) => {
  res.send("✅ Staff router is working");
});


export default router;
