import FoodService from "../models/FoodService.js";
import HousekeepingService from "../models/HousekeepingService.js";

// Get all food services
export const getAllFoodServices = async (req, res) => {
  try {
    const foods = await FoodService.find();
    res.json(foods);
  } catch (err) {
    console.error("Error fetching food services:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all housekeeping services
export const getAllHousekeepingServices = async (req, res) => {
  try {
    const services = await HousekeepingService.find();
    res.json(services);
  } catch (err) {
    console.error("Error fetching housekeeping services:", err);
    res.status(500).json({ message: "Server error" });
  }
};
