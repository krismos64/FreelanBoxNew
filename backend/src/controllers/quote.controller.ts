import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import AppError from "../utils/appError";
import { logger } from "../utils/logger";
import { generateQuotePDF } from "../../../src/utils/pdf-generator";

const prisma = new PrismaClient();

// Types
interface RequestWithUserId extends Request {
  userId: string;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface FormattedQuote {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  status: QuoteStatus;
  total: number;
  notes?: string;
  termsAndConditions?: string;
  convertedToInvoiceId?: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

type QuoteStatus = "draft" | "sent" | "accepted" | "rejected";

// Validation Schemas
const quoteItemSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
  unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
});

const quoteSchema = z.object({
  clientId: z.string().min(1, "Le client est requis"),
  date: z.string().transform((str) => new Date(str)),
  validUntil: z.string().transform((str) => new Date(str)),
  items: z.array(quoteItemSchema).min(1, "Au moins un élément est requis"),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
});

type QuoteInput = z.infer<typeof quoteSchema>;
// Create Quote
const createQuote = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const data = quoteSchema.parse(req.body);

    const client = await prisma.client.findFirst({
      where: {
        id: data.clientId,
        userId: req.userId,
      },
    });

    if (!client) {
      throw new AppError("Client non trouvé", 404);
    }

    const lastQuote = await prisma.quote.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const nextNumber = lastQuote
      ? parseInt(lastQuote.number.split("-")[3]) + 1
      : 1;
    const quoteNumber = `DEV-${currentYear}-${currentMonth}-${nextNumber
      .toString()
      .padStart(3, "0")}`;

    const items = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    const quote = await prisma.quote.create({
      data: {
        number: quoteNumber,
        date: data.date,
        validUntil: data.validUntil,
        total,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        userId: req.userId,
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
    logger.error("Error creating quote:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};

// Get Quotes
const getQuotes = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const quotes = await prisma.quote.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        client: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(quotes);
  } catch (error) {
    logger.error("Error fetching quotes:", error);
    throw error;
  }
};
// Get Single Quote
const getQuote = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        client: true,
        items: true,
      },
    });

    if (!quote) {
      throw new AppError("Devis non trouvé", 404);
    }

    res.json(quote);
  } catch (error) {
    logger.error("Error fetching quote:", error);
    throw error;
  }
};

// Update Quote
const updateQuote = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = quoteSchema.parse(req.body);

    const existingQuote = await prisma.quote.findUnique({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        items: true,
      },
    });

    if (!existingQuote) {
      throw new AppError("Devis non trouvé", 404);
    }

    if (existingQuote.status !== "draft") {
      throw new AppError(
        "Seuls les devis en brouillon peuvent être modifiés",
        400
      );
    }

    const items = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    const updatedQuote = await prisma.quote.update({
      where: {
        id,
        userId: req.userId,
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
    logger.error("Error updating quote:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};
// Update Quote Status
const updateQuoteStatus = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: QuoteStatus };

    if (!["draft", "sent", "accepted", "rejected"].includes(status)) {
      throw new AppError("Statut invalide", 400);
    }

    const quote = await prisma.quote.update({
      where: {
        id,
        userId: req.userId,
      },
      data: { status },
      include: {
        client: true,
        items: true,
      },
    });

    res.json(quote);
  } catch (error) {
    logger.error("Error updating quote status:", error);
    throw error;
  }
};

// Delete Quotes
const deleteQuotes = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { ids } = req.body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError("Liste d'identifiants invalide", 400);
    }

    const quotes = await prisma.quote.findMany({
      where: {
        id: { in: ids },
        userId: req.userId,
      },
      include: {
        invoice: true,
      },
    });

    const convertedQuotes = quotes.filter((quote) => quote.invoice);
    if (convertedQuotes.length > 0) {
      throw new AppError(
        "Impossible de supprimer des devis convertis en factures",
        400
      );
    }

    await prisma.quote.deleteMany({
      where: {
        id: { in: ids },
        userId: req.userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting quotes:", error);
    throw error;
  }
};
// Download Quote
const downloadQuote = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        client: true,
        items: true,
        user: {
          select: {
            company: true,
          },
        },
        invoice: true,
      },
    });

    if (!quote) {
      throw new AppError("Devis non trouvé", 404);
    }

    const formattedQuote: FormattedQuote = {
      id: quote.id,
      number: quote.number,
      date: quote.date.toISOString(),
      validUntil: quote.validUntil.toISOString(),
      status: quote.status as QuoteStatus,
      total: quote.total,
      notes: quote.notes || undefined,
      termsAndConditions: quote.termsAndConditions || undefined,
      convertedToInvoiceId: quote.invoice?.id || undefined,

      client: {
        id: quote.client.id,
        name: quote.client.name,
        email: quote.client.email,
        phone: quote.client.phone || undefined,
        address: quote.client.address || undefined,
      },

      items: quote.items.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
    };

    const doc = generateQuotePDF(formattedQuote, quote.user.company);
    const pdfBuffer = doc.output("arraybuffer");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=devis-${quote.number}.pdf`
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    logger.error("Error generating quote PDF:", error);
    throw error;
  }
};

export {
  createQuote,
  getQuotes,
  getQuote,
  updateQuote,
  updateQuoteStatus,
  deleteQuotes,
  downloadQuote,
};
