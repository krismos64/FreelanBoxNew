import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, clientId } = req.query;
    const start = startDate ? new Date(startDate as string) : startOfYear(new Date());
    const end = endDate ? new Date(endDate as string) : endOfYear(new Date());

    const whereClause = {
      userId: req.userId!,
      date: {
        gte: start,
        lte: end,
      },
      ...(clientId && { clientId: clientId as string }),
    };

    // Récupérer toutes les factures payées
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        ...whereClause,
        status: 'paid',
      },
      include: {
        client: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calculer les chiffres d'affaires
    const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const monthlyRevenue = new Map<string, number>();

    paidInvoices.forEach(invoice => {
      const monthKey = format(new Date(invoice.date), 'MMMM yyyy', { locale: fr });
      const current = monthlyRevenue.get(monthKey) || 0;
      monthlyRevenue.set(monthKey, current + invoice.total);
    });

    // Statistiques des devis
    const quotes = await prisma.quote.findMany({
      where: whereClause,
    });

    const totalQuotes = quotes.length;
    const acceptedQuotes = quotes.filter(quote => quote.status === 'accepted').length;
    const conversionRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;

    // Statistiques des factures
    const invoices = await prisma.invoice.findMany({
      where: whereClause,
    });

    const invoiceStats = {
      total: invoices.length,
      draft: invoices.filter(inv => inv.status === 'draft').length,
      sent: invoices.filter(inv => inv.status === 'sent').length,
      pending: invoices.filter(inv => inv.status === 'pending').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
    };

    // Statistiques des devis
    const quoteStats = {
      total: quotes.length,
      draft: quotes.filter(q => q.status === 'draft').length,
      sent: quotes.filter(q => q.status === 'sent').length,
      accepted: acceptedQuotes,
      rejected: quotes.filter(q => q.status === 'rejected').length,
    };

    // Statistiques par client
    const clientStats = await prisma.client.findMany({
      where: {
        userId: req.userId!,
        ...(clientId && { id: clientId as string }),
      },
      select: {
        id: true,
        name: true,
        revenue: true,
        quotes: {
          where: whereClause,
        },
        invoices: {
          where: {
            ...whereClause,
            status: 'paid',
          },
        },
      },
    });

    res.json({
      overview: {
        totalRevenue,
        monthlyRevenue: Array.from(monthlyRevenue.entries()).map(([month, amount]) => ({
          month,
          amount,
        })),
        conversionRate,
      },
      invoices: invoiceStats,
      quotes: quoteStats,
      clients: clientStats,
    });
  } catch (error) {
    logger.error('Error fetching statistics:', error);
    throw error;
  }
};

export const exportData = async (req: AuthRequest, res: Response) => {
  try {
    const { format } = req.query;

    const data = await prisma.user.findUnique({
      where: {
        id: req.userId!,
      },
      include: {
        company: true,
        clients: true,
        quotes: {
          include: {
            items: true,
          },
        },
        invoices: {
          include: {
            items: true,
          },
        },
        events: true,
      },
    });

    if (!data) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Supprimer les informations sensibles
    delete data.password;
    delete data.refreshTokens;

    if (format === 'csv') {
      // TODO: Implémenter l'export CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
      // res.send(convertToCSV(data));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=export.json');
      res.send(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    logger.error('Error exporting data:', error);
    throw error;
  }
};