import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

export const exportPersonalData = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId!,
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
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Supprimer les informations sensibles
    const exportData = {
      ...user,
      password: undefined,
      refreshTokens: undefined,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=personal-data.json');
    res.json(exportData);
  } catch (error) {
    logger.error('Error exporting personal data:', error);
    throw error;
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId!,
      },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier le mot de passe
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== user.password) {
      throw new AppError('Mot de passe incorrect', 401);
    }

    // Supprimer toutes les données de l'utilisateur
    await prisma.$transaction([
      prisma.refreshToken.deleteMany({
        where: { userId: req.userId! },
      }),
      prisma.event.deleteMany({
        where: { userId: req.userId! },
      }),
      prisma.invoiceItem.deleteMany({
        where: { invoice: { userId: req.userId! } },
      }),
      prisma.invoice.deleteMany({
        where: { userId: req.userId! },
      }),
      prisma.quoteItem.deleteMany({
        where: { quote: { userId: req.userId! } },
      }),
      prisma.quote.deleteMany({
        where: { userId: req.userId! },
      }),
      prisma.client.deleteMany({
        where: { userId: req.userId! },
      }),
      prisma.company.deleteMany({
        where: { userId: req.userId! },
      }),
      prisma.user.delete({
        where: { id: req.userId! },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting account:', error);
    throw error;
  }
};

export const updateConsent = async (req: AuthRequest, res: Response) => {
  try {
    const { marketing, analytics } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.userId!,
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
    logger.error('Error updating consent:', error);
    throw error;
  }
};