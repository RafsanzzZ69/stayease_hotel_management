import RoomType from "../models/roomtype.js";
import Booking from "../models/booking.js";
import Room from "../models/rooms.js";
import { io } from "../index.js";  // use exported io

export async function findAvailableRooms({ checkInDate, checkOutDate, guests }) {
  try {
    if (!checkInDate || !checkOutDate || !guests) {
      return [];
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({ message: "checkOutDate must be after checkInDate." });
    }

    // const totalGuests = (guests.adults || 0) + (guests.children || 0);
    const totalGuests = guests || 0;

    // get all room types
    const roomTypes = await RoomType.find();

    const availableRoomTypes = [];

    for (let roomType of roomTypes) {
      if (roomType.maxOccupancy.adults < totalGuests) continue; // skip if room can't handle guests

      // find active bookings that overlap with the requested range
      const overlappingBookings = await Booking.find({
        roomTypeId: roomType._id,
        status: { $in: ["confirmed", "checkin"] }, // only consider active bookings
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn }
      });

      const bookedCount = overlappingBookings.length;
      const availableRooms = roomType.totalRooms - bookedCount;

      if (availableRooms > 0) {
        const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        availableRoomTypes.push({
          roomType: roomType.roomTypeName,
          bedType: roomType.bedType,
          capacity: roomType.maxOccupancy.adults,
          view: roomType.view,
          pricePerNight: roomType.pricePerNight,
          amenities: roomType.amenities
        });
      }
    }

    return availableRoomTypes;

  } catch (err) {
    console.error("Error checking availability:", err);
    throw new Error("Unable to check room availability");
  }
};

export default findAvailableRooms;
