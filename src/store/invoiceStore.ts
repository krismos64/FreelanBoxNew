import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import type { Invoice, InvoiceSettings } from "@/types/invoice";
import { useStatisticsStore } from "@/store/statisticsStore";
import { useClientStore } from "@/store/clientStore";

const invoiceMiddleware = (config: any) => (set: any, get: any, api: any) => {
  const initialState = config(set, get, api);
  return {
    ...initialState,
    updateInvoice: (id: string, data: Partial<Invoice>) => {
      const previousInvoice = get().invoices.find(
        (inv: Invoice) => inv.id === id
      );
      const previousStatus = previousInvoice?.status;

      set((state: any) => ({
        invoices: state.invoices.map((invoice: Invoice) =>
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
      }));

      const updatedInvoice = get().invoices.find(
        (inv: Invoice) => inv.id === id
      );

      if (data.status !== undefined && data.status !== previousStatus) {
        useStatisticsStore
          .getState()
          .updateFromInvoice(updatedInvoice, previousStatus);
        if (updatedInvoice.client) {
          useClientStore
            .getState()
            .updateClientRevenue(
              updatedInvoice.client.id,
              updatedInvoice,
              previousStatus
            );
        }
      }
    },
  };
};

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
    invoiceMiddleware((set, get) => ({
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
          client: data.client!,
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

        if (newInvoice.status === "paid") {
          useStatisticsStore.getState().updateFromInvoice(newInvoice);
          if (newInvoice.client) {
            useClientStore
              .getState()
              .updateClientRevenue(newInvoice.client.id, newInvoice, null);
          }
        }

        return newInvoice;
      },

      deleteInvoices: (ids) => {
        const invoicesToDelete = get().invoices.filter(
          (invoice) =>
            ids.includes(invoice.id) ||
            ids.includes(`temp-id-${get().invoices.indexOf(invoice)}`)
        );

        invoicesToDelete.forEach((invoice) => {
          if (invoice.status === "paid") {
            useStatisticsStore
              .getState()
              .updateFromInvoice({ ...invoice, status: "draft" }, "paid");
            if (invoice.client) {
              useClientStore
                .getState()
                .updateClientRevenue(
                  invoice.client.id,
                  { ...invoice, status: "draft" },
                  "paid"
                );
            }
          }
        });

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
    })),
    {
      name: "invoices-storage",
    }
  )
);
