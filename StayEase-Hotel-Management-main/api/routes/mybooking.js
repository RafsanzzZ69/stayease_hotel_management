// GET /api/booking/my
// import express from 'express';
// import Booking from '../models/booking.js';
// import fetchUser from '../middleware/fetchuser.js';

// const router = express.Router();

// // GET /api/booking/my
// router.get('/', fetchUser, async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     // Populate room details with each booking
//     const bookings = await Booking.find({ userId }).populate('roomId');

//     res.status(200).json(bookings);
//   } catch (err) {
//     console.error('Fetching bookings failed:', err);
//     res.status(500).json({ message: 'Server error while fetching bookings.' });
//   }
// });

// export default router;
