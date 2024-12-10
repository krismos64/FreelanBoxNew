import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';
import { generatePDF } from '../utils/pdfGenerator';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().min(1, 'La quantité doit être supérieure à 0'),
  unitPrice: z.number().min(0, 'Le prix unitaire doit être positif'),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Le client est requis'),
  date: z.string().transform(str => new Date(str)),
  dueDate: z.string().transform(str => new Date(str)),
  items: z.array(invoiceItemSchema).min(1, 'Au moins un élément est requis'),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  quoteId: z.string().optional(),
});

export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const data = invoiceSchema.parse(req.body);

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

    // Si la facture est créée à partir d'un devis, vérifier le devis
    if (data.quoteId) {
      const quote = await prisma.quote.findFirst({
        where: {
          id: data.quoteId,
          userId: req.userId!,
          status: 'accepted',
        },
      });

      if (!quote) {
        throw new AppError('Devis non trouvé ou non accepté', 404);
      }
    }

    // Générer le numéro de facture
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const nextNumber = lastInvoice 
      ? parseInt(lastInvoice.number.split('-')[3]) + 1 
      : 1;
    const invoiceNumber = `FAC-${currentYear}-${currentMonth}-${nextNumber.toString().padStart(3, '0')}`;

    // Calculer le total
    const items = data.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    // Créer la facture
    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        date: data.date,
        dueDate: data.dueDate,
        total,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        userId: req.userId!,
        clientId: data.clientId,
        quoteId: data.quoteId,
        items: {
          create: items,
        },
      },
      include: {
        client: true,
        items: true,
        quote: true,
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    logger.error('Error creating invoice:', error);
    if (error instanceof z.ZodError) {
      throw new AppError('Données invalides', 400);
    }
    throw error;
  }
};

export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: req.userId!,
      },
      include: {
        client: true,
        items: true,
        quote: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(invoices);
  } catch (error) {
    logger.error('Error fetching invoices:', error);
    throw error;
  }
};

export const getInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        client: true,
        items: true,
        quote: true,
      },
    });

    if (!invoice) {
      throw new AppError('Facture non trouvée', 404);
    }

    res.json(invoice);
  } catch (error) {
    logger.error('Error fetching invoice:', error);
    throw error;
  }
};

export const updateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = invoiceSchema.parse(req.body);

    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        items: true,
      },
    });

    if (!existingInvoice) {
      throw new AppError('Facture non trouvée', 404);
    }

    if (existingInvoice.status !== 'draft') {
      throw new AppError('Seules les factures en brouillon peuvent être modifiées', 400);
    }

    // Calculer le nouveau total
    const items = data.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    // Mettre à jour la facture
    const updatedInvoice = await prisma.invoice.update({
      where: {
        id,
        userId: req.userId!,
      },
      data: {
        date: data.date,
        dueDate: data.dueDate,
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
        quote: true,
      },
    });

    res.json(updatedInvoice);
  } catch (error) {
    logger.error('Error updating invoice:', error);
    if (error instanceof z.ZodError) {
      throw new AppError('Données invalides', 400);
    }
    throw error;
  }
};

export const updateInvoiceStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'sent', 'pending', 'paid'].includes(status)) {
      throw new AppError('Statut invalide', 400);
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        client: true,
      },
    });

    if (!existingInvoice) {
      throw new AppError('Facture non trouvée', 404);
    }

    // Si la facture passe au statut "payée", mettre à jour le chiffre d'affaires du client
    if (status === 'paid' && existingInvoice.status !== 'paid') {
      await prisma.client.update({
        where: { id: existingInvoice.client.id },
        data: {
          revenue: {
            increment: existingInvoice.total,
          },
        },
      });
    }
    // Si la facture passe d'un statut "payée" à un autre statut, décrémenter le chiffre d'affaires
    else if (existingInvoice.status === 'paid' && status !== 'paid') {
      await prisma.client.update({
        where: { id: existingInvoice.client.id },
        data: {
          revenue: {
            decrement: existingInvoice.total,
          },
        },
      });
    }

    const invoice = await prisma.invoice.update({
      where: {
        id,
        userId: req.userId!,
      },
      data: { status },
      include: {
        client: true,
        items: true,
        quote: true,
      },
    });

    res.json(invoice);
  } catch (error) {
    logger.error('Error updating invoice status:', error);
    throw error;
  }
};

export const deleteInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError('Liste d\'identifiants invalide', 400);
    }

    // Vérifier qu'aucune facture n'est payée
    const invoices = await prisma.invoice.findMany({
      where: {
        id: { in: ids },
        userId: req.userId!,
      },
    });

    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    if (paidInvoices.length > 0) {
      throw new AppError('Impossible de supprimer des factures payées', 400);
    }

    await prisma.invoice.deleteMany({
      where: {
        id: { in: ids },
        userId: req.userId!,
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting invoices:', error);
    throw error;
  }
};

export const downloadInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      throw new AppError('Facture non trouvée', 404);
    }

    const pdfBuffer = await generatePDF(invoice, 'invoice');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture-${invoice.number}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Error generating invoice PDF:', error);
    throw error;
  }
};