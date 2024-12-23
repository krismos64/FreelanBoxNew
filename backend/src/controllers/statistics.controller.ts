import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { startOfYear, endOfYear, format } from "date-fns";
import { fr } from "date-fns/locale";
import AppError from "../utils/appError";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

// Types
interface RequestWithUserId extends Request {
  userId: string;
}

interface StatisticsQuery {
  startDate?: string;
  endDate?: string;
  clientId?: string;
}

interface InvoiceStats {
  total: number;
  draft: number;
  sent: number;
  pending: number;
  paid: number;
}

interface QuoteStats {
  total: number;
  draft: number;
  sent: number;
  accepted: number;
  rejected: number;
}

interface MonthlyRevenue {
  month: string;
  amount: number;
}

interface StatisticsResponse {
  overview: {
    totalRevenue: number;
    monthlyRevenue: MonthlyRevenue[];
    conversionRate: number;
  };
  invoices: InvoiceStats;
  quotes: QuoteStats;
  clients: any[]; // Type à définir selon la structure exacte des données client
}

const getStatistics = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate, clientId } = req.query as StatisticsQuery;
    const start = startDate ? new Date(startDate) : startOfYear(new Date());
    const end = endDate ? new Date(endDate) : endOfYear(new Date());

    const whereClause = {
      userId: req.userId,
      date: {
        gte: start,
        lte: end,
      },
      ...(clientId && { clientId }),
    };

    // Récupérer toutes les factures payées
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        ...whereClause,
        status: "paid",
      },
      include: {
        client: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calculer les chiffres d'affaires
    const totalRevenue = paidInvoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );
    const monthlyRevenue = new Map<string, number>();

    paidInvoices.forEach((invoice) => {
      const monthKey = format(new Date(invoice.date), "MMMM yyyy", {
        locale: fr,
      });
      const current = monthlyRevenue.get(monthKey) || 0;
      monthlyRevenue.set(monthKey, current + invoice.total);
    });

    // Statistiques des devis
    const quotes = await prisma.quote.findMany({
      where: whereClause,
    });

    const totalQuotes = quotes.length;
    const acceptedQuotes = quotes.filter(
      (quote) => quote.status === "accepted"
    ).length;
    const conversionRate =
      totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;

    // Statistiques des factures
    const invoices = await prisma.invoice.findMany({
      where: whereClause,
    });

    const invoiceStats: InvoiceStats = {
      total: invoices.length,
      draft: invoices.filter((inv) => inv.status === "draft").length,
      sent: invoices.filter((inv) => inv.status === "sent").length,
      pending: invoices.filter((inv) => inv.status === "pending").length,
      paid: invoices.filter((inv) => inv.status === "paid").length,
    };

    // Statistiques des devis
    const quoteStats: QuoteStats = {
      total: quotes.length,
      draft: quotes.filter((q) => q.status === "draft").length,
      sent: quotes.filter((q) => q.status === "sent").length,
      accepted: acceptedQuotes,
      rejected: quotes.filter((q) => q.status === "rejected").length,
    };

    // Statistiques par client
    const clientStats = await prisma.client.findMany({
      where: {
        userId: req.userId,
        ...(clientId && { id: clientId }),
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
            status: "paid",
          },
        },
      },
    });

    const response: StatisticsResponse = {
      overview: {
        totalRevenue,
        monthlyRevenue: Array.from(monthlyRevenue.entries()).map(
          ([month, amount]) => ({
            month,
            amount,
          })
        ),
        conversionRate,
      },
      invoices: invoiceStats,
      quotes: quoteStats,
      clients: clientStats,
    };

    res.json(response);
  } catch (error) {
    logger.error("Error fetching statistics:", error);
    throw error;
  }
};

const exportData = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { format } = req.query as { format?: string };

    const data = await prisma.user.findUnique({
      where: {
        id: req.userId,
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
      throw new AppError("Utilisateur non trouvé", 404);
    }

    // Supprimer les informations sensibles
    const exportData = {
      ...data,
      password: undefined,
      refreshTokens: undefined,
    };

    if (format === "csv") {
      // TODO: Implémenter l'export CSV
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=export.csv");
      // res.send(convertToCSV(data));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=export.json");
      res.send(JSON.stringify(exportData, null, 2));
    }
  } catch (error) {
    logger.error("Error exporting data:", error);
    throw error;
  }
};

export { getStatistics, exportData };
