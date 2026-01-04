// 
// const { Schema } = mongoose;

// const roomSchema = new Schema({
//   roomNumber: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   roomType: {
//     type: String,
//     required: true,
//     enum: ['Single', 'Double', 'Suite', 'Deluxe'],
//   },
//   pricePerNight: {
//     type: Number,
//     required: true,
//   },
//   capacity: {
//     type: Number,
//     required: true,
//   },
//   amenities: {
//     type: [String],
//     default: [],
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true,
//   },
//   // images: { type: [String], required: true },
//   ratings: {
//     average: { type: Number, default: 0 },
//     count: { type: Number, default: 0 }
//   },
//   createdAt: {
//     type: Date,
//     default: () => new Date(),
//   },
// },{ timestamps: true });

// const Room = mongoose.model('rooms', roomSchema);
// export default Room;


import mongoose from 'mongoose';


const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType",
    required: true
  },
  status: {
    type: String,
    enum: ["available", "booked", "maintenance"],
    default: "available"
  },
  floor: {
    type: Number,
    required: true
  },
  
  
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Room = mongoose.model("Room", roomSchema);
export default Room;





