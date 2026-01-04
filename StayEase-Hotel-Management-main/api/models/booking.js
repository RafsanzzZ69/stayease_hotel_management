// import mongoose from 'mongoose';
// import Rooms from './rooms.js';

// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//   },
//   roomId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'rooms',
//     required: true,
//   },
//   checkInDate: {
//     type: Date,
//     required: true,
//   },
//   checkOutDate: {
//     type: Date,
//     required: true,
//   },
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: () => new Date(),
//   },
// });
// const Booking = mongoose.model('bookings', bookingSchema);
// export default Booking;



// models/booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    default: null, // assigned at check-in
  },
  roomNumber: {
    type: String,
    default: null, // assigned at check-in
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed",  "cancelled", "checked-in", "checked-out","completed"],
    default: "confirmed", // booking happens only after payment
  },
  refundAmount: {
    type: Number,
    default: 0, // set only if cancelled
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
