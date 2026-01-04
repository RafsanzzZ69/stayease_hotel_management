import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    BookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    serviceType: {
          type: String,
          enum: ["Food", "Housekeeping"],
          required: true,
        },
    serviceTypeRef: {
          type: String,
          required: true,
          enum: ["FoodService", "HousekeepingService"],
        },

    // Array of items (food or housekeeping)
    items: [
      {
        
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "serviceTypeRef",
        },
        name : {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        priceAtOrder: {
          type: Number,
          default: 0,
        },
        instructions: {
          type: String,
          trim: true,
        },
      },
    ],

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // staff member assigned
      default: null,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Preparing", "Delivered", "Completed", "Cancelled"],
      default: "Pending",
    },

    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceRequest", serviceRequestSchema);
