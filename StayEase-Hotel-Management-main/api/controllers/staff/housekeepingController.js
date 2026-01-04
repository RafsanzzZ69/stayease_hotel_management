import ServiceRequest from "/Users/tahura/Desktop/StayEase/api/models/ServiceRequest.js";

import { io } from "/Users/tahura/Desktop/StayEase/api/index.js"; // make sure io is exported from index.js

// 📌 Get all housekeeping requests assigned to a staff
export const getAssignedHousekeepingRequests = async (req, res) => {
  try {
    const { staffId } = req.params; // assuming JWT middleware adds req.user
    console.log("came here");

    const requests = await ServiceRequest.find({
      serviceType: "Housekeeping",
      assignedTo: staffId,
    })
      .populate("user", "name")
      .populate("roomNumber")
      .populate("assignedTo", "name");
      

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching housekeeping requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch housekeeping requests",
      error: error.message,
    });
  }
};

// 📌 Update housekeeping request status
export const updateHousekeepingStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // e.g. { "status": "In Progress" }

    const allowedStatuses = ["Pending", "In Progress", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update",
      });
    }

    const request = await ServiceRequest.findOneAndUpdate(
      { _id: requestId, serviceType: "Housekeeping" },
      { status },
      { new: true }
    )
      .populate("user", "name")
      .populate("roomNumber")
      .populate("assignedTo", "name");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Housekeeping request not found",
      });
    }

    // ✅ Emit socket update
    io.emit("housekeepingRequestUpdated", request);

    res.status(200).json({
      success: true,
      message: `Housekeeping request status updated to ${status}`,
      data: request,
    });
  } catch (error) {
    console.error("Error updating housekeeping status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update housekeeping status",
      error: error.message,
    });
  }
};
