import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';
import { sendNotification } from '../utils/notifications';

const prisma = new PrismaClient();

const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  start: z.string().transform(str => new Date(str)),
  end: z.string().transform(str => new Date(str)),
  color: z.string().optional(),
  reminder: z.number().optional(),
  category: z.string().optional(),
});

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const data = eventSchema.parse(req.body);

    const event = await prisma.event.create({
      data: {
        ...data,
        userId: req.userId!,
      },
    });

    // Planifier la notification si un rappel est défini
    if (event.reminder) {
      const reminderDate = new Date(event.start.getTime() - event.reminder * 60000);
      await sendNotification({
        userId: req.userId!,
        title: 'Rappel d\'événement',
        message: `L'événement "${event.title}" commence dans ${event.reminder} minutes`,
        scheduledFor: reminderDate,
      });
    }

    res.status(201).json(event);
  } catch (error) {
    logger.error('Error creating event:', error);
    if (error instanceof z.ZodError) {
      throw new AppError('Données invalides', 400);
    }
    throw error;
  }
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const { start, end } = req.query;

    const events = await prisma.event.findMany({
      where: {
        userId: req.userId!,
        ...(start && end ? {
          start: {
            gte: new Date(start as string),
          },
          end: {
            lte: new Date(end as string),
          },
        } : {}),
      },
      orderBy: {
        start: 'asc',
      },
    });

    res.json(events);
  } catch (error) {
    logger.error('Error fetching events:', error);
    throw error;
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = eventSchema.parse(req.body);

    const event = await prisma.event.update({
      where: {
        id,
        userId: req.userId!,
      },
      data,
    });

    // Mettre à jour la notification si nécessaire
    if (event.reminder) {
      const reminderDate = new Date(event.start.getTime() - event.reminder * 60000);
      await sendNotification({
        userId: req.userId!,
        title: 'Rappel d\'événement',
        message: `L'événement "${event.title}" commence dans ${event.reminder} minutes`,
        scheduledFor: reminderDate,
      });
    }

    res.json(event);
  } catch (error) {
    logger.error('Error updating event:', error);
    if (error instanceof z.ZodError) {
      throw new AppError('Données invalides', 400);
    }
    throw error;
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: {
        id,
        userId: req.userId!,
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting event:', error);
    throw error;
  }
};