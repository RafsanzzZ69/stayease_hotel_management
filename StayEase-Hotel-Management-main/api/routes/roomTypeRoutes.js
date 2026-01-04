import express from "express";
import { createRoomType, getAllRoomTypes } from "../controllers/roomTypeController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create a new room type
router.post("/", upload.array("images", 5), createRoomType);

// Get all room types (optional, useful for frontend dropdown)
router.get("/", getAllRoomTypes);

export default router;
import { check, validationResult } from "express-validator";