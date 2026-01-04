import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema({
  roomTypeName: {
    type: String,
    required: true,   // e.g., "Penthouse Sea View", "Royal Hill Suite"
    unique: true
  },
  description: {
    type: String,
    required: true    // Short marketing-style description
  },
  sizeSqm: {
    type: Number,
    required: true    // e.g., 120 (square meters)
  },
  bedType: {
    type: String,
    required: true    // e.g., "King", "2 Queens", "Emperor Bed"
  },
  view: {
    type: String,
    required: true    // e.g., "Ocean", "Hills", "City Skyline"
  },
  features: {
    type: [String],   // e.g., ["Private Pool", "Jacuzzi", "Butler Service"]
    default: []
  },
  amenities: {
    type: [String],   // e.g., ["Wi-Fi", "Minibar", "In-room Spa"]
    default: []
  },
  maxOccupancy: {  
    adults: { type: Number, required: true },
    children: { type: Number, default: 0 }
  },
  pricePerNight: {
    type: Number,
    required: true    // base price (e.g., in USD)
  },
  totalRooms: {
    type: Number,
    required: true    // how many physical rooms of this type exist
  },
  images: {
    type: [String],   // URLs for frontend display
    default: []
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },  // average rating 0–5
    count: { type: Number, default: 0 }                     // number of reviews
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RoomType = mongoose.model("RoomType", roomTypeSchema);

export default RoomType;

