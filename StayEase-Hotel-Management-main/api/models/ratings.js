// models/Rating.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false, // optional if rating is for a service instead of a booking
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: false, // optional if rating is for a room/booking instead of a service
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["room", "service", "staff"], // type of rating
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
