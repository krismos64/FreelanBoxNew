import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import type { Quote, QuoteFormData, QuoteSettings } from '@/types/quote';

interface QuoteStore {
  quotes: Quote[];
  settings: QuoteSettings;
  addQuote: (data: QuoteFormData) => Quote;
  updateQuote: (id: string, data: Partial<Quote>) => void;
  deleteQuotes: (ids: string[]) => void;
  updateQuoteStatus: (id: string, status: Quote['status']) => void;
  getQuoteById: (id: string) => Quote | undefined;
  updateSettings: (settings: Partial<QuoteSettings>) => void;
  generateQuoteNumber: () => string;
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quotes: [],
      settings: {
        prefix: 'DEV',
        nextNumber: 1,
        defaultValidityDays: 30,
        defaultNotes: '',
        defaultTermsAndConditions: 'TVA non applicable, article 293 B du CGI.',
      },
      addQuote: (data) => {
        const newQuote: Quote = {
          id: crypto.randomUUID(),
          number: get().generateQuoteNumber(),
          date: data.date,
          validUntil: data.validUntil,
          status: 'draft',
          client: data.client,
          items: data.items.map(item => ({
            id: crypto.randomUUID(),
            ...item,
            total: item.quantity * item.unitPrice
          })),
          total: data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
          notes: data.notes,
          termsAndConditions: data.termsAndConditions,
        };

        set(state => ({
          quotes: [...state.quotes, newQuote],
          settings: {
            ...state.settings,
            nextNumber: state.settings.nextNumber + 1,
          },
        }));

        return newQuote;
      },
      updateQuote: (id, data) =>
        set(state => ({
          quotes: state.quotes.map(quote =>
            quote.id === id ? { ...quote, ...data } : quote
          ),
        })),
      deleteQuotes: (ids) =>
        set(state => ({
          quotes: state.quotes.filter(quote => !ids.includes(quote.id)),
        })),
      updateQuoteStatus: (id, status) =>
        set(state => ({
          quotes: state.quotes.map(quote =>
            quote.id === id ? { ...quote, status } : quote
          ),
        })),
      getQuoteById: (id) => get().quotes.find(quote => quote.id === id),
      updateSettings: (newSettings) =>
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        })),
      generateQuoteNumber: () => {
        const { prefix, nextNumber } = get().settings;
        const year = format(new Date(), 'yyyy');
        const month = format(new Date(), 'MM');
        const paddedNumber = String(nextNumber).padStart(3, '0');
        return `${prefix}-${year}-${month}-${paddedNumber}`;
      },
    }),
    {
      name: 'quotes-storage',
    }
  )
);