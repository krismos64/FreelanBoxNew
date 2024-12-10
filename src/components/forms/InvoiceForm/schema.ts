import { z } from 'zod';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().min(1, 'La quantité doit être supérieure à 0'),
  unitPrice: z.number().min(0, 'Le prix unitaire doit être positif'),
});

export const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Le client est requis'),
  date: z.string().min(1, 'La date est requise'),
  dueDate: z.string().min(1, 'La date d\'échéance est requise'),
  items: z.array(invoiceItemSchema).min(1, 'Au moins un élément est requis'),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
});