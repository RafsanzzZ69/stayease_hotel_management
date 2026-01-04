import Rating from "../models/ratings.js";
import Booking from "../models/booking.js";
import ServiceRequest from "../models/ServiceRequest.js";

export const submitRating = async (req, res) => {
  try {
    const { userId, bookingId, serviceId, rating, feedback, type } = req.body;

    // Validation
    if (!userId || !rating || !type) {
      return res.status(400).json({ message: "userId, rating, and type are required" });
    }

    if (!["room", "service"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'room' or 'service'" });
    }

    // Optional: Validate booking or service existence
    if (type === "room" && bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
    }

    if (type === "service" && serviceId) {
      const service = await ServiceRequest.findById(serviceId);
      if (!service) return res.status(404).json({ message: "Service not found" });
    }

    // Create rating
    const newRating = new Rating({
      user: userId,
      booking: bookingId || null,
      service: serviceId || null,
      rating,
      feedback: feedback || "",
      type,
    });

    await newRating.save();

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      data: newRating,
    });
  } catch (err) {
    console.error("Error submitting rating:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
