import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // The user who receives the notification
    },
    
    message: {
      type: String,
      required: true, // The notification text/message
    },
    read: {
      type: Boolean,
      default: false, // Whether the user has seen the notification
    },
    meta: {
      type: Object, // Optional extra info, e.g., bookingId, orderId
    },
    
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
