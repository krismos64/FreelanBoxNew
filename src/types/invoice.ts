import { Client } from './client';
import { Quote } from './quote';

export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'paid';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  client: Client;
  items: InvoiceItem[];
  total: number;
  notes?: string;
  termsAndConditions?: string;
  convertedFromQuoteId?: string;
  quote?: Quote;
}

export interface InvoiceSettings {
  prefix: string;
  nextNumber: number;
  defaultDueDays: number;
  defaultNotes: string;
  defaultTermsAndConditions: string;
}