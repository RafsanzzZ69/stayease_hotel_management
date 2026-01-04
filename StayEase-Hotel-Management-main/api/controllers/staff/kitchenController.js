import ServiceRequest from "/Users/tahura/Desktop/StayEase/api/models/ServiceRequest.js";
import {io} from "../../index.js";
export const getFoodOrders = async (req, res) => {
  try {
    // Optional filter: exclude delivered orders if query.active=true
    const filter = { serviceType: "Food" };

    if (req.query.active === "true") {
      filter.status = { $ne: "Delivered" };
    }

    const foodOrders = await ServiceRequest.find(filter)
      .populate("roomNumber").populate("assignedTo", "name").populate("user", "name").sort({ createdAt: -1 }); // room info

    res.status(200).json({
      success: true,
      count: foodOrders.length,
      data: foodOrders,
    });
  } catch (error) {
    console.error("Error fetching food orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch food orders",
      error: error.message,
    });
  }
};






// ✅ Update food order status (Pending → Preparing → Delivered)
// export const updateFoodOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body; // e.g. { "status": "Preparing" }

//     // Only allow specific status updates
//     const allowedStatuses = ["Pending", "In Progress", "Preparing", "Delivered" , "Completed", "Cancelled"];
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status update",
//       });
//     }

//     const order = await ServiceRequest.findOneAndUpdate(
//       { _id: orderId, serviceType: "Food" },
//       { status },
//       { new: true }
//     )
//       .populate("user", "name ")
//       .populate("roomNumber");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Food order not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       data: order,
//     });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update order status",
//       error: error.message,
//     });
//   }
// };

// ✅ Update food order status (chef action)
// export const updateFoodOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status , assignedTo } = req.body; // e.g. { "status": "Preparing" }

//     const allowedStatuses = ["Pending", "In Progress", "Preparing", "Delivered"];
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status update",
//       });
//     }

//     const order = await ServiceRequest.findOneAndUpdate(
//       { _id: orderId, serviceType: "Food" },
//       { status, assignedTo },
//       { new: true }
//     )
//       .populate("user", "name")
//       .populate("roomNumber").populate("assignedTo", "name");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Food order not found",
//       });
//     }

//     // ✅ If status is Delivered, schedule auto-complete after 5 minutes
//     if (status === "Delivered") {
//       setTimeout(async () => {
//         try {
//           const currentOrder = await ServiceRequest.findById(orderId);
//           if (currentOrder && currentOrder.status === "Delivered") {
//             currentOrder.status = "Completed";
//             await currentOrder.save();
//             console.log(`✅ Order ${orderId} auto-marked as Completed`);
//           }
//         } catch (err) {
//           console.error("Error auto-completing order:", err.message);
//         }
//       }, 1 * 60 * 1000); // 1 minute
//     }

//     res.status(200).json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       data: order,
//     });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update order status",
//       error: error.message,
//     });
//   }
// };



export const updateFoodOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, assignedTo } = req.body;

    const allowedStatuses = ["Pending", "Preparing", "Delivered","In Progress"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update",
      });
    }

    // Build update object conditionally
    let updateFields = { status };

    // ✅ Only assign chef/staff when moving to Preparing
    if (status === "Preparing" && assignedTo) {
      updateFields.assignedTo = assignedTo;
    }

    const order = await ServiceRequest.findOneAndUpdate(
      { _id: orderId, serviceType: "Food" },
      updateFields,
      { new: true }
    )
      .populate("user", "name")
      .populate("roomNumber")
      .populate("assignedTo", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Food order not found",
      });
    }

    // ✅ Auto-complete after 5 minutes if Delivered
    if (status === "Delivered") {
      setTimeout(async () => {
        try {
          const currentOrder = await ServiceRequest.findById(orderId);
          if (currentOrder && currentOrder.status === "Delivered") {
            currentOrder.status = "Completed";
            await currentOrder.save();
            console.log(`✅ Order ${orderId} auto-marked as Completed`);
          }
        } catch (err) {
          console.error("Error auto-completing order:", err.message);
        }
      }, 1 * 60 * 1000); // 1 minute
    }
    io.emit("foodOrderUpdated", order);
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
