// controllers/bookingController.js
import Booking from "../models/booking.js";
import RoomType from "../models/roomtype.js";
import Room from "../models/rooms.js";
import { io } from "../index.js";
import { sendNotification , sendNotificationToMany } from "../services/notificationService.js";
import Payment from "../models/payment.js";
import User from "../models/users.js";
export const createBooking = async (req, res) => {
  try {
    const { userId, roomTypeId, checkInDate, checkOutDate, guests } = req.body;

    // Validate inputs
    if (!userId || !roomTypeId || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if RoomType exists
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    // Calculate total nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // Calculate total price
    const totalPrice = nights * roomType.pricePerNight;

    // Create booking
    const booking = new Booking({
      userId,
      roomTypeId,
      roomId: null, // will be assigned later
      roomNumber: null, // will be assigned later
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      status: "confirmed", // since payment is already done
    });

    await booking.save();
    //save payment record
    const payment = new Payment({
      user: userId,
      amount: totalPrice,
    });
    await payment.save();

   //notify user about booking confirmation
    const notificationMessage = `Your Booking request has been Confirmed.`;
    const notification =  await sendNotification(userId, notificationMessage);
    io.emit("newNotification", notification);

    
//     // Notify all receptionists about new booking
const receptionistNotificationMessage = `New booking created with . Kindly assign a room.`;

// // 👉 Find all users who are receptionists
// const receptionists = await User.find({ department: "reception" });

// if (receptionists.length > 0) {
//   const receptionistIds = receptionists.map((r) => r._id);
//   const receptionistNotifications = await sendNotificationToMany(
//     receptionistIds,
//     receptionistNotificationMessage
//   );

//   // Emit real-time notification to each receptionist
//   receptionistNotifications.forEach((notif) => {
//     io.emit("newNotification", notif);
//   });
// }

try {
  const receptionists = await User.find({ department: "reception" });

  if (receptionists.length > 0) {
    const receptionistIds = receptionists.map((r) => r._id);
    const receptionistNotifications = await sendNotificationToMany(
      receptionistIds,
      receptionistNotificationMessage
    );

    receptionistNotifications.forEach((notif) => {
      io.emit("newNotification", notif);
    });
  } else {
    console.log("⚠️ No receptionists found.");
  }
} catch (err) {
  console.error("Error notifying receptionists:", err);
}

    




    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get bookings by userId
export const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // find all bookings that belong to this user
    const bookings = await Booking.find({ userId }).populate("roomTypeId" , "roomTypeName");

    // if (!bookings || bookings.length === 0) {
    //   return res.status(400).json({ message: "No bookings found for this user" });
    // }
    // Always return an array, even if empty
    res.status(200).json(bookings);

    res.status(201).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
