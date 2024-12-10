import type { Quote } from '@/types/quote';

export interface QuoteFormData {
  clientId: string;
  date: string;
  validUntil: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
  termsAndConditions?: string;
}

export interface QuoteFormProps {
  onSubmit: (data: QuoteFormData) => void;
  initialData?: Partial<Quote>;
  isSubmitting?: boolean;
}