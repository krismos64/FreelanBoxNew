import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const prisma = new PrismaClient();

// Types
interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  userId: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}

const sendNotification = async (
  payload: NotificationPayload
): Promise<void> => {
  try {
    await prisma.notification.create({
      data: {
        type: payload.type,
        title: payload.title,
        message: payload.message,
        userId: payload.userId,
      },
    });
    logger.info("Notification created:", payload);
  } catch (error) {
    logger.error("Error sending notification:", error);
    throw error;
  }
};

const markNotificationsAsRead = async (
  userId: string,
  notificationIds: string[]
): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    logger.error("Error marking notifications as read:", error);
    throw error;
  }
};

const getUnreadNotifications = async (
  userId: string
): Promise<Notification[]> => {
  try {
    return await prisma.notification.findMany({
      where: {
        userId,
        read: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    logger.error("Error fetching unread notifications:", error);
    throw error;
  }
};

export {
  sendNotification,
  markNotificationsAsRead,
  getUnreadNotifications,
  NotificationPayload,
  Notification,
};
