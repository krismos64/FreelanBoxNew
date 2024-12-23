import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import AppError from "../utils/appError";
import { logger } from "../utils/logger";
import { uploadFile } from "../utils/fileUpload";

const prisma = new PrismaClient();

// Types
interface RequestWithUserId extends Request {
  userId: string;
  file?: Express.Multer.File;
}

// Validation schema
const clientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  siret: z.string().optional(),
});

const createClient = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const data = clientSchema.parse(req.body);
    let logoUrl: string | undefined;

    if (req.file) {
      logoUrl = await uploadFile(req.file);
    }

    const client = await prisma.client.create({
      data: {
        ...data,
        logo: logoUrl,
        userId: req.userId,
        revenue: 0,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    logger.error("Error creating client:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};

const getClients = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        quotes: {
          select: {
            id: true,
            number: true,
            date: true,
            status: true,
            total: true,
          },
        },
        invoices: {
          select: {
            id: true,
            number: true,
            date: true,
            status: true,
            total: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(clients);
  } catch (error) {
    logger.error("Error fetching clients:", error);
    throw error;
  }
};

const getClient = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        quotes: true,
        invoices: true,
      },
    });

    if (!client) {
      throw new AppError("Client non trouvé", 404);
    }

    res.json(client);
  } catch (error) {
    logger.error("Error fetching client:", error);
    throw error;
  }
};

const updateClient = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = clientSchema.parse(req.body);
    let logoUrl: string | undefined;

    const existingClient = await prisma.client.findUnique({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingClient) {
      throw new AppError("Client non trouvé", 404);
    }

    if (req.file) {
      logoUrl = await uploadFile(req.file);
    }

    const updatedClient = await prisma.client.update({
      where: {
        id,
        userId: req.userId,
      },
      data: {
        ...data,
        logo: logoUrl || existingClient.logo,
      },
    });

    res.json(updatedClient);
  } catch (error) {
    logger.error("Error updating client:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};

const deleteClients = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError("Liste d'identifiants invalide", 400);
    }

    await prisma.client.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId: req.userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting clients:", error);
    throw error;
  }
};

export { createClient, getClients, getClient, updateClient, deleteClients };
