import { z } from 'zod';
import { invoiceSchema } from './schema';
import type { Invoice } from '@/types/invoice';

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void;
  initialData?: Partial<Invoice>;
  isSubmitting?: boolean;
  convertedFromQuote?: boolean;
}