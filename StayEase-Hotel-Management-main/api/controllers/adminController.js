import Booking from "../models/booking.js";
import User from "../models/users.js";
import Payment from "../models/payment.js";
import Room from "../models/rooms.js";
import Rating from "../models/ratings.js";
// ✅ Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "name email").populate("roomTypeId","roomTypeName");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get revenue stats
// export const getRevenueStats = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ status: "confirmed"  });
//     const payments = await Payment.find();
//     const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
//     const monthlyPayments = payments
//       .filter(p => {
//         const month = new Date(p.createdAt).getMonth();
//         return month === new Date().getMonth();
//       })
//       .reduce((sum, p) => sum + p.amount, 0);

//     const total = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

//     const currentMonth = new Date().getMonth();
//     const monthly = bookings
//       .filter(b => new Date(b.checkInDate).getMonth() === currentMonth)
//       .reduce((sum, b) => sum + b.totalPrice, 0);

//     const occupancyRate = Math.round((bookings.length / 48) * 100); // assuming 48 rooms

//     res.json({ total, monthly, occupancyRate });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch revenue stats" });
//   }
// };

// ✅ Get revenue & booking stats
// export const getRevenueStats = async (req, res) => {
//   try {
//     // All confirmed bookings
//     const bookings = await Booking.find();
    
//     // All payments
//     const payments = await Payment.find();

//     // All users
//     const totalUsers = await User.countDocuments();
//     //all rooms
//     const totalRooms = await Room.countDocuments();

//     // Total revenue
//     const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

//     // Monthly revenue (current month)
//     const currentMonth = new Date().getMonth();
//     const currentYear = new Date().getFullYear();
//     const monthlyRevenue = payments
//       .filter(p => {
//         const date = new Date(p.createdAt);
//         return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
//       })
//       .reduce((sum, p) => sum + p.amount, 0);

//     // Total bookings
//     const totalBookings = bookings.length;

//     // Monthly bookings (check-ins in current month)
//     const monthlyBookings = bookings.filter(b => {
//       const checkIn = new Date(b.checkInDate);
//       return checkIn.getMonth() === currentMonth && checkIn.getFullYear() === currentYear;
//     }).length;

//     // Currently active bookings (today is between check-in and check-out)
//     const today = new Date();
//     const currentlyActiveBookings = bookings.filter(b => {
//       const checkIn = new Date(b.checkInDate);
//       const checkOut = new Date(b.checkOutDate);
//       return today >= checkIn && today <= checkOut;
//     }).length;

//     // Occupancy rate (based on total rooms)
//     const occupancyRate = Math.round((currentlyActiveBookings / totalRooms) * 100);

//     res.json({
//       totalRevenue,
//       monthlyRevenue,
//       totalBookings,
//       monthlyBookings,
//       currentlyActiveBookings,
//       occupancyRate,
//       totalUsers
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch revenue stats" });
//   }
// };



export const getRevenueStats = async (req, res) => {
  try {
    // All confirmed bookings
    const bookings = await Booking.find();
    // All payments
    const payments = await Payment.find();
    // All users
    const totalUsers = await User.countDocuments();
    // All rooms
    const totalRooms = await Room.countDocuments();

    // Total revenue
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Monthly revenue (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = payments
      .filter(p => {
        const date = new Date(p.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    // Total bookings
    const totalBookings = bookings.length;

    // Monthly bookings (check-ins in current month)
    const monthlyBookings = bookings.filter(b => {
      const checkIn = new Date(b.checkInDate);
      return checkIn.getMonth() === currentMonth && checkIn.getFullYear() === currentYear;
    }).length;

    // Currently active bookings (today is between check-in and check-out)
    const today = new Date();
    const currentlyActiveBookings = bookings.filter(b => {
      const checkIn = new Date(b.checkInDate);
      const checkOut = new Date(b.checkOutDate);
      return today >= checkIn && today <= checkOut;
    }).length;

    // Today’s check-ins (exact match for today’s date)
    const todaysCheckins = bookings.filter(b => {
      const checkIn = new Date(b.checkInDate);
      return checkIn.toDateString() === today.toDateString();
    }).length;

    // Occupancy rate (based on total rooms)
    const occupancyRate = Math.round((currentlyActiveBookings / totalRooms) * 100);

    // // Customer Satisfaction (average rating)
    // const ratings = await Rating.find();
    // const customerSatisfaction =
    //   ratings.length > 0
    //     ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
    //     : null;

    // // Booking Conversion (confirmed bookings ÷ total bookings * 100)
    // const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
    // const bookingConversion =
    //   totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(2) : 0;

    // // Repeat Customers (users with more than 1 booking)
    // const userBookingCounts = {};
    // bookings.forEach(b => {
    //   userBookingCounts[b.userId] = (userBookingCounts[b.userId] || 0) + 1;
    // });
    // const repeatCustomers = Object.values(userBookingCounts).filter(count => count > 1).length;

    // Customer Satisfaction (average rating out of 5 → percentage)
const ratings = await Rating.find();
const customerSatisfaction =
  ratings.length > 0
    ? ((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) / 5 * 100).toFixed(2)
    : null;

// Booking Conversion (confirmed bookings ÷ total bookings * 100)
const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
const bookingConversion =
  totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(2) : 0;

// Repeat Customers (users with more than 1 booking ÷ total users * 100)
const userBookingCounts = {};
bookings.forEach(b => {
  userBookingCounts[b.userId] = (userBookingCounts[b.userId] || 0) + 1;
});
const repeatCustomers =
  totalUsers > 0
    ? (Object.values(userBookingCounts).filter(count => count > 1).length / totalUsers * 100).toFixed(2)
    : 0;


    res.json({
      totalRevenue,
      monthlyRevenue,
      totalBookings,
      monthlyBookings,
      currentlyActiveBookings,
      todaysCheckins,
      occupancyRate,
      totalUsers,
      customerSatisfaction,
      bookingConversion,
      repeatCustomers,
      totalRooms
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch revenue stats" });
  }
};






// // ✅ Assign or update staff role
// export const updateStaffRole = async (req, res) => {
//   try {
//     const { userId } = req.params; // staff user to update
//     const { accountType, department, departmentRole, floorNumber , salary } = req.body;

    

//     // Fetch the user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Only staff/admin can have this endpoint
//     if (!["staff", "admin"].includes(accountType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid accountType. Must be 'staff' or 'admin'",
//       });
//     }

//     // Update fields
//     user.accountType = accountType;

//     if (accountType === "staff") {
//       user.department = department || user.department;
//       user.departmentRole = departmentRole || user.departmentRole;
//       user.salary = salary || user.salary;

//       // Only housekeeping staff needs floorNumber
//       if (department === "housekeeping" && floorNumber !== undefined) {
//         user.floorNumber = floorNumber;
//       } else {
//         user.floorNumber = undefined;
//       }
//     } else {
//       // Admins don’t need staff-specific fields
//       user.department = undefined;
//       user.departmentRole = undefined;
//       user.floorNumber = undefined;
//     }

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "User role updated successfully",
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         accountType: user.accountType,
//         department: user.department,
//         departmentRole: user.departmentRole,
//         floorNumber: user.floorNumber,
//         salary: user.salary,
//       },
//     });
//   } catch (err) {
//     console.error("Error updating user role:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


export const updateStaffRole = async (req, res) => {
  try {
    const { userId } = req.params; // staff user to update
    const { department, departmentRole, floorNumber, salary } = req.body;

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accountType = user.accountType; // get accountType from DB

    // Only staff can have staff-specific fields updated
    if (accountType == "guest") {
      return res.status(400).json({
        success: false,
        message: "Only staff accounts can be updated here",
      });
    }

    // Update fields
    user.department = department || user.department;
    user.departmentRole = departmentRole || user.departmentRole;
    user.salary = salary || user.salary;

    // Only housekeeping staff needs floorNumber
    if (user.department === "housekeeping" && floorNumber !== undefined) {
      user.floorNumber = floorNumber;
    } else {
      user.floorNumber = undefined;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Staff details updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        department: user.department,
        departmentRole: user.departmentRole,
        floorNumber: user.floorNumber,
        salary: user.salary,
      },
    });
  } catch (err) {
    console.error("Error updating staff details:", err);
    res.status(500).json({ message: "Server error" });
  }
};








// DELETE /api/admin/users/:userId
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: `User ${user.name} has been deleted successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
