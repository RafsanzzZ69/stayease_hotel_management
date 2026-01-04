import notificationModel from '../models/notification.js';

export const sendNotification = async (userId, message) => {
  try {
    const newNotification = await notificationModel.create({
      user: userId,
      message,
      read: false,
    });
    return newNotification;
    
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}


export const sendNotificationToMany = async (userIds, message) => {
  const newNotifications = await Promise.all(
    userIds.map((uid) =>
      new notificationModel({ user: uid, message, read: false }).save()
    )
  );
  return newNotifications;
} 