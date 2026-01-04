// routes/aiRoutes.js
import express from "express";
import { getRoomSuggestions } from "../controllers/aiController.js";
import { enrichRoomSuggestions } from "../controllers/aiRoomMergeController.js";

const router = express.Router();

// POST /api/ai/room-suggestions
router.post("/room-suggestions", getRoomSuggestions);
// New route for enriching Gemini suggestions with DB data
router.post("/enrich-suggestions", enrichRoomSuggestions);
export default router;


