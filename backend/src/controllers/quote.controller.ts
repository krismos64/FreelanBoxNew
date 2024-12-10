import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';
import { generatePDF } from '../utils/pdfGenerator';

const prisma = new PrismaClient();

const quoteItemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().min(1, 'La quantité doit être supérieure à 0'),
  unitPrice: z.number().min(0, 'Le prix unitaire doit être positif'),
});

const quoteSchema = z.object({
  clientId: z.string().min(1, 'Le client est requis'),
  date: z.string().transform(str => new Date(str)),
  validUntil: z.string().transform(str => new Date(str)),
  items: z.array(quoteItemSchema).min(1, 'Au moins un élément est requis'),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
});

export const createQuote = async (req: AuthRequest, res: Response) => {
  try {
    const data = quoteSchema.parse(req.body);

    // Vérifier que le client existe et appartient à l'utilisateur
    const client = await prisma.client.findFirst({
      where: {
        id: data.clientId,
        userId: req.userId!,
      },
    });

    if (!client) {
      throw new AppError('Client non trouvé', 404);
    }

    // Générer le numéro de devis
    const lastQuote = await prisma.quote.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const nextNumber = lastQuote 
      ? parseInt(lastQuote.number.split('-')[3]) + 1 
      : 1;
    const quoteNumber = `DEV-${currentYear}-${currentMonth}-${nextNumber.toString().padStart(3, '0')}`;

    // Calculer le total
    const items = data.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    // Créer le devis
    const quote = await prisma.quote.create({
      data: {
        number: quoteNumber,
        date: data.date,
        validUntil: data.validUntil,
        total,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        userId: req.userId!,
        clientId: data.clientId,
        items: {
          create: items,
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    res.status(201).json(quote);
  } catch (error) {
    logger.error('Error creating quote:', error);
    if (error instanceof z.ZodError) {
      throw new AppError('Données invalides', 400);
    }
    throw error;
  }
};

export const getQuotes = async (req: AuthRequest, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany({
      where: {
        userId: req.userId!,
      },
      include: {
        client: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(quotes);
  } catch (error) {
    logger.error('Error fetching quotes:', error);
    throw error;
  }
};

export const getQuote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        client: true,
        items: true,
      },
    });

    if (!quote) {
      throw new AppError('Devis non trouvé', 404);
    }

    res.json(quote);
  } catch (error) {
    logger.error('Error fetching quote:', error);
    throw error;
  }
};

export const updateQuote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = quoteSchema.parse(req.body);

    const existingQuote = await prisma.quote.findUnique({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        items: true,
      },
    });

    if (!existingQuote) {
      throw new AppError('Devis non trouvé', 404);
    }

    if (existingQuote.status !== 'draft') {
      throw new AppError('Seuls les devis en brouillon peuvent être modifiés', 400);
    }

    // Calculer le nouveau total
    const items = data.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    // Mettre à jour le devis
    const updatedQuote = await prisma.quote.update({
      where: {
        id,
        userId: req.userId!,
      },
      data: {
        date: data.date,
        validUntil: data.validUntil,
        total,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        clientId: data.clientId,
        items: {
          deleteMany: {},
          create: items,
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    res.json(updatedQuote);
  } catch (error) {
    logger.error('Error updating quote:', error);
    if (error instanceof z.ZodError) {
      throw new AppError('Données invalides', 400);
    }
    throw error;
  }
};

export const updateQuoteStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'sent', 'accepted', 'rejected'].includes(status)) {
      throw new AppError('Statut invalide', 400);
    }

    const quote = await prisma.quote.update({
      where: {
        id,
        userId: req.userId!,
      },
      data: { status },
      include: {
        client: true,
        items: true,
      },
    });

    res.json(quote);
  } catch (error) {
    logger.error('Error updating quote status:', error);
    throw error;
  }
};

export const deleteQuotes = async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError('Liste d\'identifiants invalide', 400);
    }

    // Vérifier qu'aucun devis n'est converti en facture
    const quotes = await prisma.quote.findMany({
      where: {
        id: { in: ids },
        userId: req.userId!,
      },
      include: {
        invoice: true,
      },
    });

    const convertedQuotes = quotes.filter(quote => quote.invoice);
    if (convertedQuotes.length > 0) {
      throw new AppError('Impossible de supprimer des devis convertis en factures', 400);
    }

    await prisma.quote.deleteMany({
      where: {
        id: { in: ids },
        userId: req.userId!,
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting quotes:', error);
    throw error;
  }
};

export const downloadQuote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        client: true,
        items: true,
      },
    });

    if (!quote) {
      throw new AppError('Devis non trouvé', 404);
    }

    const pdfBuffer = await generatePDF(quote, 'quote');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=devis-${quote.number}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Error generating quote PDF:', error);
    throw error;
  }
};