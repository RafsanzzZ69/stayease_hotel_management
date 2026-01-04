import RoomType from "../models/roomtype.js";
import Booking from "../models/booking.js";
import Room from "../models/rooms.js";
import { io } from "../index.js";  // use exported io
import findAvailableRooms from "./aiAvailability.js";

export const checkAvailability = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, guests } = req.body;

    if (!checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ message: "checkInDate, checkOutDate and guests are required." });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({ message: "checkOutDate must be after checkInDate." });
    }

    // const totalGuests = (guests.adults || 0) + (guests.children || 0);
    const totalGuests = guests || 0;

    //experiment
    // const availableRoomTypes = await findAvailableRooms({ checkInDate, checkOutDate, guests });

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
          roomType,
        
          availableRooms,
          pricePerNight: roomType.pricePerNight,
          totalNights,
          totalPrice: totalNights * roomType.pricePerNight,

        });
      }
    }

    return res.json({ availableRoomTypes });

  } catch (err) {
    console.error("Error checking availability:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// room availability for specific type of room 

export const getAvailableRoomsForType = async (req, res) => {
  try {
    const { roomType, checkInDate, checkOutDate } = req.body;

    if (!roomType || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "roomType, checkInDate and checkOutDate are required." });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({ message: "checkOutDate must be after checkInDate." });
    }

    // 1. Get all rooms for the given type
    const rooms = await Room.find({ roomType });

    if (!rooms.length) {
      return res.json({ availableRooms: [], count: 0 });
    }

    const roomIds = rooms.map(r => r._id);

    // 2. Get all overlapping bookings for these rooms
    const overlappingBookings = await Booking.find({
      roomId: { $in: roomIds },
      status: { $in: [ "checked-in"] },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn }
    });

    // 3. Mark occupied rooms
    const occupiedRoomIds = new Set(overlappingBookings.map(b => String(b.roomId)));

    // 4. Filter available rooms
    const availableRooms = rooms.filter(r => !occupiedRoomIds.has(String(r._id)));

    return res.json({
      availableRooms,
      count: availableRooms.length
    });

  } catch (err) {
    console.error("Error finding available rooms:", err);
    res.status(500).json({ message: "Server error" });
  }
};