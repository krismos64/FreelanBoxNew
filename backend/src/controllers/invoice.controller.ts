import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import AppError from "../utils/appError";
import { logger } from "../utils/logger";
import { generateInvoicePDF } from "../../../src/utils/pdf-generator";

const prisma = new PrismaClient();

// Types
interface RequestWithUserId extends Request {
  userId: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface FormattedInvoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: string;
  total: number;
  notes?: string;
  termsAndConditions?: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

type InvoiceStatus = "draft" | "sent" | "pending" | "paid";

// Validation Schemas
const invoiceItemSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
  unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Le client est requis"),
  date: z.string().transform((str) => new Date(str)),
  dueDate: z.string().transform((str) => new Date(str)),
  items: z.array(invoiceItemSchema).min(1, "Au moins un élément est requis"),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  quoteId: z.string().optional(),
});

type InvoiceInput = z.infer<typeof invoiceSchema>;
// Create Invoice
const createInvoice = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const data = invoiceSchema.parse(req.body);

    const client = await prisma.client.findFirst({
      where: {
        id: data.clientId,
        userId: req.userId,
      },
    });

    if (!client) {
      throw new AppError("Client non trouvé", 404);
    }

    if (data.quoteId) {
      const quote = await prisma.quote.findFirst({
        where: {
          id: data.quoteId,
          userId: req.userId,
          status: "accepted",
        },
      });

      if (!quote) {
        throw new AppError("Devis non trouvé ou non accepté", 404);
      }
    }

    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const nextNumber = lastInvoice
      ? parseInt(lastInvoice.number.split("-")[3]) + 1
      : 1;
    const invoiceNumber = `FAC-${currentYear}-${currentMonth}-${nextNumber
      .toString()
      .padStart(3, "0")}`;

    const items = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        date: data.date,
        dueDate: data.dueDate,
        total,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        userId: req.userId,
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
    logger.error("Error creating invoice:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};

// Get Invoices
const getInvoices = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        client: true,
        items: true,
        quote: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(invoices);
  } catch (error) {
    logger.error("Error fetching invoices:", error);
    throw error;
  }
};
// Get Single Invoice
const getInvoice = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        client: true,
        items: true,
        quote: true,
      },
    });

    if (!invoice) {
      throw new AppError("Facture non trouvée", 404);
    }

    res.json(invoice);
  } catch (error) {
    logger.error("Error fetching invoice:", error);
    throw error;
  }
};

// Update Invoice
const updateInvoice = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = invoiceSchema.parse(req.body);

    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        items: true,
      },
    });

    if (!existingInvoice) {
      throw new AppError("Facture non trouvée", 404);
    }

    if (existingInvoice.status !== "draft") {
      throw new AppError(
        "Seules les factures en brouillon peuvent être modifiées",
        400
      );
    }

    const items = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    const updatedInvoice = await prisma.invoice.update({
      where: {
        id,
        userId: req.userId,
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
    logger.error("Error updating invoice:", error);
    if (error instanceof z.ZodError) {
      throw new AppError("Données invalides", 400);
    }
    throw error;
  }
};
// Update Invoice Status
const updateInvoiceStatus = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: InvoiceStatus };

    if (!["draft", "sent", "pending", "paid"].includes(status)) {
      throw new AppError("Statut invalide", 400);
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        client: true,
      },
    });

    if (!existingInvoice) {
      throw new AppError("Facture non trouvée", 404);
    }

    if (status === "paid" && existingInvoice.status !== "paid") {
      await prisma.client.update({
        where: { id: existingInvoice.client.id },
        data: {
          revenue: {
            increment: existingInvoice.total,
          },
        },
      });
    } else if (existingInvoice.status === "paid" && status !== "paid") {
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
        userId: req.userId,
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
    logger.error("Error updating invoice status:", error);
    throw error;
  }
};

// Delete Invoices
const deleteInvoices = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { ids } = req.body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError("Liste d'identifiants invalide", 400);
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        id: { in: ids },
        userId: req.userId,
      },
    });

    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === "paid"
    );
    if (paidInvoices.length > 0) {
      throw new AppError("Impossible de supprimer des factures payées", 400);
    }

    await prisma.invoice.deleteMany({
      where: {
        id: { in: ids },
        userId: req.userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting invoices:", error);
    throw error;
  }
};
// Download Invoice
const downloadInvoice = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
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
      },
    });

    if (!invoice) {
      throw new AppError("Facture non trouvée", 404);
    }

    const formattedInvoice: FormattedInvoice = {
      id: invoice.id,
      number: invoice.number,
      date: invoice.date.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      status: invoice.status,
      total: invoice.total,
      notes: invoice.notes || undefined,
      termsAndConditions: invoice.termsAndConditions || undefined,

      client: {
        id: invoice.client.id,
        name: invoice.client.name,
        email: invoice.client.email,
        phone: invoice.client.phone || undefined,
        address: invoice.client.address || undefined,
        createdAt: invoice.client.createdAt.toISOString(),
      },

      items: invoice.items.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
    };

    const doc = generateInvoicePDF(formattedInvoice, invoice.user.company);
    const pdfBuffer = doc.output("arraybuffer");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=facture-${invoice.number}.pdf`
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    logger.error("Error generating invoice PDF:", error);
    throw error;
  }
};

export {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoices,
  downloadInvoice,
};
