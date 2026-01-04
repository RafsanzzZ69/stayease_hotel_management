
import Booking from "../../models/booking.js";
import Room from "../../models/rooms.js";
import {io} from "../../index.js";



// Only staff/admin can access
export const assignRoom = async (req, res) => {
  try {
    

    const { bookingId } = req.params;
    const { roomId } = req.body;

    if (!roomId) return res.status(400).json({ error: "roomId is required" });

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({ error: "Cannot assign room to this booking" });
    }

    // Check room exists
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.status !== "available") return res.status(400).json({ error: "Room not available" });

    // Check for overlapping bookings
    // const overlapping = await Booking.findOne({
    //   roomId: roomId,
    //   status: { $nin: ["cancelled", "checked-out"] },
    //   $or: [
    //     { checkIn: { $lt: booking.checkOut }, checkOut: { $gt: booking.checkIn } },
    //   ],
    // });

    // if (overlapping) return res.status(409).json({ error: "Room already assigned in this period" });

    // Assign room
    booking.roomId = room._id;
    booking.roomNumber = room.roomNumber;
    // booking.status = "checked-in"; // optional: confirm automatically
    await booking.save();
    io.emit("roomAssigned", booking);
    res.status(200).json({ message: "Room assigned successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


