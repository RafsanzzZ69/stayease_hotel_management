import express from "express";
import { getAllFoodServices, getAllHousekeepingServices } from "../controllers/serviceController.js";

const router = express.Router();

// GET all food services
router.get("/food", getAllFoodServices);

// GET all housekeeping services
router.get("/housekeeping", getAllHousekeepingServices);

export default router;
