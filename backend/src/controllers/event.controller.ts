import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import AppError from "../utils/appError";
import { logger } from "../utils/logger";
import { sendNotification } from "../utils/notifications";

const prisma = new PrismaClient();

// Types
interface RequestWithUserId extends Request {
  userId: string;
}

interface Notification {
  userId: string;
  type: string;
  title: string;
  message: string;
}

const eventSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  start: z.string().transform((str) => new Date(str)),
  end: z.string().transform((str) => new Date(str)),
  color: z.string().optional(),
  reminder: z.number().optional(),
  category: z.string().optional(),
});

type EventInput = z.infer<typeof eventSchema>;

const createEvent = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const data = eventSchema.parse(req.body);

    const event = await prisma.event.create({
      data: {
        ...data,
        userId: req.userId,
      },
    });

    if (event.reminder) {
      await sendNotification({
        userId: req.userId,
        type: "event_reminder",
        title: "Rappel d'événement",
        message: `L'événement "${event.title}" commence dans ${event.reminder} minutes`,
      } as Notification);
    }

    res.status(201).json(event);
  } catch (error) {
    logger.error("Error creating event:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};

const getEvents = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { start, end } = req.query as { start?: string; end?: string };

    const events = await prisma.event.findMany({
      where: {
        userId: req.userId,
        ...(start && end
          ? {
              start: {
                gte: new Date(start),
              },
              end: {
                lte: new Date(end),
              },
            }
          : {}),
      },
      orderBy: {
        start: "asc",
      },
    });

    res.json(events);
  } catch (error) {
    logger.error("Error fetching events:", error);
    throw error;
  }
};

const updateEvent = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = eventSchema.parse(req.body);

    const event = await prisma.event.update({
      where: {
        id,
        userId: req.userId,
      },
      data,
    });

    if (event.reminder) {
      await sendNotification({
        userId: req.userId,
        type: "event_reminder",
        title: "Rappel d'événement",
        message: `L'événement "${event.title}" commence dans ${event.reminder} minutes`,
      } as Notification);
    }

    res.json(event);
  } catch (error) {
    logger.error("Error updating event:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};

const deleteEvent = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: {
        id,
        userId: req.userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting event:", error);
    throw error;
  }
};

export { createEvent, getEvents, updateEvent, deleteEvent };
