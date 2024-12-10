import { z } from 'zod';

const quoteItemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().min(1, 'La quantité doit être supérieure à 0'),
  unitPrice: z.number().min(0, 'Le prix unitaire doit être positif'),
});

export const quoteSchema = z.object({
  clientId: z.string().min(1, 'Le client est requis'),
  date: z.string().min(1, 'La date est requise'),
  validUntil: z.string().min(1, 'La date de validité est requise'),
  items: z.array(quoteItemSchema).min(1, 'Au moins un élément est requis'),
  notes: z.string().optional(),
  termsAndConditions: z.string().min(1, 'Les conditions sont requises'),
});