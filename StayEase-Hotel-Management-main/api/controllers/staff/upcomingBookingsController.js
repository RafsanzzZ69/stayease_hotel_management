// controllers/staffController.js
import Booking from "/Users/tahura/Desktop/StayEase/api/models/booking.js";



export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email number") // fetch user details
      .populate("roomTypeId", "roomTypeName pricePerNight")   // fetch room type info
      .populate("roomId", "roomNumber")       // fetch room number if assigned
      .sort({ checkInDate: 1 });              // sort by nearest check-in first

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(b => ({
        id: b._id,
        status: b.status,
        checkIn: b.checkInDate,
        checkOut: b.checkOutDate,
        guests: b.guests,
        totalPrice: b.totalPrice,
        refundAmount: b.refundAmount,
        user: b.userId,         // { name, email, number }
        roomType: b.roomTypeId, // { name, price }
        room: b.roomId ? b.roomId.roomNumber : null,
      }))
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
