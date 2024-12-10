import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  scheduledFor: Date;
}

export const sendNotification = async (payload: NotificationPayload) => {
  try {
    // Enregistrer la notification dans la base de données
    await prisma.notification.create({
      data: {
        title: payload.title,
        message: payload.message,
        scheduledFor: payload.scheduledFor,
        userId: payload.userId,
      },
    });

    // TODO: Implémenter l'envoi de notifications push
    // Par exemple avec Firebase Cloud Messaging ou une autre solution

    logger.info('Notification scheduled:', payload);
  } catch (error) {
    logger.error('Error sending notification:', error);
    throw error;
  }
};

export const checkPendingNotifications = async () => {
  try {
    const now = new Date();
    const pendingNotifications = await prisma.notification.findMany({
      where: {
        scheduledFor: {
          lte: now,
        },
        sent: false,
      },
    });

    for (const notification of pendingNotifications) {
      // TODO: Envoyer la notification
      await prisma.notification.update({
        where: { id: notification.id },
        data: { sent: true },
      });
    }
  } catch (error) {
    logger.error('Error checking pending notifications:', error);
  }
};