import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import AppError from "../utils/appError";
import { logger } from "../utils/logger";
import { hashPassword } from "../utils/auth";

const prisma = new PrismaClient();

// Types
interface RequestWithUserId extends Request {
  userId: string;
}

interface ConsentUpdate {
  marketing?: boolean;
  analytics?: boolean;
}

type ExportUserData = Omit<
  User & {
    company: any;
    clients: any[];
    quotes: any[];
    invoices: any[];
    events: any[];
  },
  "password" | "refreshTokens"
>;

const exportPersonalData = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      include: {
        company: true,
        clients: true,
        quotes: true,
        invoices: true,
        events: true,
      },
    });

    if (!user) {
      throw new AppError("Utilisateur non trouvé", 404);
    }

    // Supprimer les informations sensibles
    const exportData: ExportUserData = {
      ...user,
      password: undefined,
      refreshTokens: undefined,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=personal-data.json"
    );
    res.json(exportData);
  } catch (error) {
    logger.error("Error exporting personal data:", error);
    throw error;
  }
};

const deleteAccount = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { password } = req.body as { password: string };

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      throw new AppError("Utilisateur non trouvé", 404);
    }

    // Vérifier le mot de passe
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== user.password) {
      throw new AppError("Mot de passe incorrect", 401);
    }

    // Supprimer toutes les données de l'utilisateur
    await prisma.$transaction([
      prisma.refreshToken.deleteMany({
        where: { userId: req.userId },
      }),
      prisma.event.deleteMany({
        where: { userId: req.userId },
      }),
      prisma.invoiceItem.deleteMany({
        where: { invoice: { userId: req.userId } },
      }),
      prisma.invoice.deleteMany({
        where: { userId: req.userId },
      }),
      prisma.quoteItem.deleteMany({
        where: { quote: { userId: req.userId } },
      }),
      prisma.quote.deleteMany({
        where: { userId: req.userId },
      }),
      prisma.client.deleteMany({
        where: { userId: req.userId },
      }),
      prisma.company.deleteMany({
        where: { userId: req.userId },
      }),
      prisma.user.delete({
        where: { id: req.userId },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting account:", error);
    throw error;
  }
};

const updateConsent = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { marketing, analytics } = req.body as ConsentUpdate;

    const user = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        marketingConsent: marketing,
        analyticsConsent: analytics,
      },
    });

    res.json({
      marketingConsent: user.marketingConsent,
      analyticsConsent: user.analyticsConsent,
    });
  } catch (error) {
    logger.error("Error updating consent:", error);
    throw error;
  }
};

export { exportPersonalData, deleteAccount, updateConsent };
