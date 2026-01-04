import {getNotifications, markAsRead} from "../controllers/notificationController.js";
import express from "express";

const router = express.Router();

// Route to fetch notifications for a user
router.get("/:userId", getNotifications);

// Route to mark a notification as read
router.patch("/read/:notificationId", markAsRead);

export default router;