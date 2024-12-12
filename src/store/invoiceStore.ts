import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import type { Invoice, InvoiceSettings } from "@/types/invoice";

interface InvoiceStore {
  invoices: Invoice[];
  settings: InvoiceSettings;
  addInvoice: (data: Partial<Invoice>) => Invoice;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoices: (ids: string[]) => void;
  generateInvoiceNumber: () => string;
  updateSettings: (settings: Partial<InvoiceSettings>) => void;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      settings: {
        prefix: "INV",
        nextNumber: 1,
        defaultDueDays: 30,
        defaultNotes: "",
        defaultTermsAndConditions: "TVA non applicable, article 293 B du CGI.",
      },
      addInvoice: (data) => {
        const total =
          data.items?.reduce(
            (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0),
            0
          ) || 0;

        const newInvoice: Invoice = {
          id: crypto.randomUUID(),
          number: get().generateInvoiceNumber(),
          date: data.date || new Date().toISOString(),
          dueDate: data.dueDate || new Date().toISOString(),
          status: "draft",
          client: data.client,
          items:
            data.items?.map((item) => ({
              ...item,
              id: crypto.randomUUID(),
              total: (item.unitPrice || 0) * (item.quantity || 0),
            })) || [],
          total,
          notes: data.notes || "",
          termsAndConditions: data.termsAndConditions || "",
        };

        set((state) => ({
          invoices: [...state.invoices, newInvoice],
          settings: {
            ...state.settings,
            nextNumber: state.settings.nextNumber + 1,
          },
        }));

        return newInvoice;
      },
      updateInvoice: (id, data) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id
              ? {
                  ...invoice,
                  ...data,
                  total:
                    data.items?.reduce(
                      (sum, item) =>
                        sum + (item.unitPrice || 0) * (item.quantity || 0),
                      0
                    ) || invoice.total,
                }
              : invoice
          ),
        })),
      deleteInvoices: (ids) => {
        set((state) => ({
          invoices: state.invoices.filter(
            (invoice) =>
              !ids.includes(invoice.id) &&
              !ids.includes(`temp-id-${state.invoices.indexOf(invoice)}`)
          ),
        }));
      },

      generateInvoiceNumber: () => {
        const { prefix, nextNumber } = get().settings;
        const year = format(new Date(), "yyyy");
        const month = format(new Date(), "MM");
        const paddedNumber = String(nextNumber).padStart(3, "0");

        set((state) => ({
          settings: { ...state.settings, nextNumber: nextNumber + 1 },
        }));

        return `${prefix}-${year}-${month}-${paddedNumber}`;
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: "invoices-storage",
    }
  )
);
