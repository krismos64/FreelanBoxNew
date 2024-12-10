import type { Invoice } from './invoice';
import type { Quote } from './quote';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  siret?: string;
  logo?: string;
  createdAt: string;
  revenue?: number;
  invoices?: Invoice[];
  quotes?: Quote[];
}

export type SortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'date-asc'
  | 'date-desc'
  | 'revenue-asc'
  | 'revenue-desc';