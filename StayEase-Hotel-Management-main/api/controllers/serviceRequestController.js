import ServiceRequest from "../models/ServiceRequest.js";
import Room from "../models/rooms.js";
import User from "../models/users.js";
import FoodService from "../models/FoodService.js";
import HousekeepingService from "../models/HousekeepingService.js";
import { io } from "../index.js";
import { sendNotification } from "../services/notificationService.js";

// Create a new service request
// export const createServiceRequest = async (req, res) => {
//   try {
//     const { userId, BookingId, roomNumber, serviceType, serviceTypeRef, items, totalAmount } = req.body;

//     // ensure serviceType and serviceTypeRef match
//     if (
//       (serviceType === "Food" && serviceTypeRef !== "FoodService") ||
//       (serviceType === "Housekeeping" && serviceTypeRef !== "HousekeepingService")
//     ) {
//       return res.status(400).json({ message: "Invalid service type and reference combination" });
//     }

//     const newRequest = new ServiceRequest({
//       user: userId,
//       BookingId,
//       roomNumber,
//       serviceType,
//       serviceTypeRef,
//       items,
//       totalAmount,
//     });

//     await newRequest.save();
//     io.emit("serviceRequestCreated", newRequest);
//     res.status(201).json({ message: "Service request created successfully", request: newRequest });
//   } catch (error) {
//     console.error("Error creating service request:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// Create a new service request
export const createServiceRequest = async (req, res) => {
  try {
    const {
      userId,
      BookingId,
      roomNumber,
      serviceType,
      serviceTypeRef,
      items,
      totalAmount,
    } = req.body;

    if (
      (serviceType === "Food" && serviceTypeRef !== "FoodService") ||
      (serviceType === "Housekeeping" && serviceTypeRef !== "HousekeepingService")
    ) {
      return res
        .status(400)
        .json({ message: "Invalid service type and reference combination" });
    }

    let assignedTo = null;

    // ✅ Auto-assign housekeeping request to staff with matching floor
    if (serviceType === "Housekeeping") {
      const room = await Room.findOne({ roomNumber : roomNumber });
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const floorNumber = room.floor;
      const staff = await User.findOne({ floorNumber, department: "housekeeping" });

      if (staff) {
        assignedTo = staff._id;
        console.log(`✅ Housekeeping request  auto-assigned to staff `);
      }
      else {
        console.log(`❌ Housekeeping request could not be auto-assigned`);
      }
    }

    const newRequest = new ServiceRequest({
      user: userId,
      BookingId,
      roomNumber,
      serviceType,
      serviceTypeRef,
      items,
      totalAmount,
      assignedTo,
    });

    await newRequest.save();
   // ✅ Send notification to user
   const notificationMessage = `Your ${serviceType} request has been created successfully.`;
   const notification =  await sendNotification(userId, notificationMessage);
    console.log("✅ Notification sent to user");
    // 3️⃣ Optionally emit to all connected clients
    io.emit("newNotification", notification);
  //  // ✅ Notify staff based on department
  //   let department = "";
  //   if (serviceType === "Food") department = "kitchen";
  //   else if (serviceType === "Housekeeping") department = "housekeeping";

  //   if (department) {
  //     const staffMembers = await User.find({ accountType: "staff", department });

  //     for (const staff of staffMembers) {
  //       const staffMessage = `New ${serviceType} request for room ${roomNumber}`;
  //       const staffNotification = await sendNotification(staff._id, staffMessage);
  //       io.emit("newNotification", staffNotification); // emit to all; frontend filters by userId
  //     }
  //   }

  //notify all staff in the relevant department

  // 2️⃣ Notify staff based on service type
    let staffList = [];
    if (serviceType === "Food") {
      // Find all chefs
      staffList = await User.find({ department: "kitchen" });
    } else if (serviceType === "Housekeeping") {
      // Find all housekeeping staff (or just the assigned one)
      if (assignedTo) {
    // Notify only the assigned staff
    staffList = await User.find({ _id: assignedTo });
  } else {
    staffList = []; // No assigned staff
  }
    }

    if (staffList.length > 0) {
      const staffIds = staffList.map(s => s._id);
      const staffNotifications = await Promise.all(
        staffIds.map(id =>
          sendNotification(id, `New ${serviceType} request in room ${roomNumber}`)
        )
      );
      staffNotifications.forEach(n => io.emit("newNotification", n));
      console.log(`✅ Notifications sent to ${staffList.length} staff members`);
    }

    // ✅ Emit event based on type
    if (serviceType === "Food") {
      io.emit("foodOrderCreated", newRequest);
    } else if (serviceType === "Housekeeping") {
      io.emit("housekeepingRequestCreated", newRequest);
    }

    res.status(201).json({
      message: "Service request created successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating service request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};





// ✅ Get all food orders of a specific user
export const getUserFoodOrders = async (req, res) => {
  try {
    const {userId} = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Fetch all service requests of type "Food" for the user
    const orders = await ServiceRequest.find({
      user: userId,
      serviceType: "Food",
    }).populate("user", "name").populate("roomNumber").populate("assignedTo", "name");
    // .select("items status roomNumber totalAmount createdAt")
    // Format response
    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      roomNumber: order.roomNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        instructions: item.instructions,
      })),
      createdAt: order.createdAt,
    }));

    res.status(200).json({ success: true, orders: orders });
  } catch (error) {
    console.error("Error fetching user food orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};








// ✅ Get all housekeeping requests of a specific user
export const getUserHousekeepingRequests = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Fetch all service requests of type "Housekeeping" for the user
    const requests = await ServiceRequest.find({
      user: userId,
      serviceType: "Housekeeping",
    }).populate("assignedTo", "name").populate("user", "name").populate("roomNumber");

    // .select("items status roomNumber totalAmount createdAt")

    // Format response
    const formattedRequests = requests.map((request) => ({
      orderId: request._id,
      roomNumber: request.roomNumber,
      status: request.status,
      totalAmount: request.totalAmount,
      items: request.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        instructions: item.instructions,
      })),
      createdAt: request.createdAt,
    }));

    res.status(200).json({ success: true, requests: requests });
  } catch (error) {
    console.error("Error fetching user housekeeping requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
