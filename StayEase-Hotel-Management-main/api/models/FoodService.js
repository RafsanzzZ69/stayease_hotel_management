import mongoose from "mongoose";

const foodServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Main Course", "Drinks", "Dessert", "Snacks", "Others"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
const FoodService = mongoose.model("FoodService", foodServiceSchema);
export default FoodService;
