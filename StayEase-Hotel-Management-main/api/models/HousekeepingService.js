import mongoose from "mongoose";

const housekeepingServiceSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      default: 0, // housekeeping is usually free
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const HousekeepingService = mongoose.model("HousekeepingService", housekeepingServiceSchema);
export default HousekeepingService;
