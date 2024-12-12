export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  status: QuoteStatus;
  client: Client;
  items: QuoteItem[];
  total: number;
  notes?: string;
  termsAndConditions?: string;
  convertedToInvoiceId?: string;
}

export interface QuoteFormData {
  clientId: string;
  date: string;
  validUntil: string;
  items: Omit<QuoteItem, "id" | "total">[];
  notes?: string;
  termsAndConditions?: string;
}

export interface QuoteSettings {
  prefix: string;
  nextNumber: number;
  defaultValidityDays: number;
  defaultNotes: string;
  defaultTermsAndConditions: string;
}
