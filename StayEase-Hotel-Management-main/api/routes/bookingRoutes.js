// routes/bookingRoutes.js
import express from "express";
import { createBooking , getBookingsByUser } from "../controllers/bookingController.js";

const router = express.Router();

// Create new booking
router.post("/", createBooking);

// Get bookings by userId
router.get("/user/:id", getBookingsByUser);


export default router;


