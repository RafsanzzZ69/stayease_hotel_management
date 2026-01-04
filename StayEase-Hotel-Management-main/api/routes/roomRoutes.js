
import express from 'express';
const router = express.Router();
// const roomController = require("../controllers/roomController");
import { createRoom,getAllRooms } from "../controllers/roomController.js";

// Create a new room
router.post("/", createRoom);

// Get all rooms
router.get("/", getAllRooms);

export default router;
