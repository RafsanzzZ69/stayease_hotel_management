import express from "express";
import { checkAvailability , getAvailableRoomsForType } from "../controllers/availabilityController.js";

const router = express.Router();

// POST /api/availability
router.post("/", checkAvailability);

// POST /api/availability/room-type
router.post("/room-type", getAvailableRoomsForType);


export default router;
