import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import type { Invoice, InvoiceSettings } from "@/types/invoice";
import { useClientStore } from "./clientStore";
import { useStatisticsStore } from "./statisticsStore";

interface InvoiceStore {
  invoices: Invoice[];
  settings: InvoiceSettings;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoices: (ids: string[]) => void;
  updateSettings: (settings: Partial<InvoiceSettings>) => void;
  generateInvoiceNumber: () => string;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      settings: {
        prefix: "FAC",
        nextNumber: 1,
        defaultDueDays: 30,
        defaultNotes: "",
        defaultTermsAndConditions: "TVA non applicable, article 293 B du CGI.",
      },
      addInvoice: (invoice) => {
        set((state) => ({
          invoices: [...state.invoices, invoice],
          settings: {
            ...state.settings,
            nextNumber: state.settings.nextNumber + 1,
          },
        }));

        // Mise à jour des statistiques si la facture est payée
        if (invoice.status === "paid") {
          useStatisticsStore.getState().updateFromInvoice(invoice);
        }

        // Mise à jour du chiffre d'affaires du client
        const clientStore = useClientStore.getState();
        const client = clientStore.getClientById(invoice.client.id);
        if (client && invoice.status === "paid") {
          clientStore.updateClient(client.id, {
            revenue: (client.revenue || 0) + invoice.total,
          });
        }
      },
      updateInvoice: (id, updatedInvoice) => {
        const oldInvoice = get().invoices.find((inv) => inv.id === id);

        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
          ),
        }));

        // Mise à jour des statistiques si le statut change
        if (oldInvoice && updatedInvoice.status) {
          useStatisticsStore
            .getState()
            .updateFromInvoice(
              { ...oldInvoice, ...updatedInvoice },
              oldInvoice.status
            );
        }

        // Mise à jour du chiffre d'affaires du client
        if (oldInvoice && updatedInvoice.status) {
          const clientStore = useClientStore.getState();
          const client = clientStore.getClientById(oldInvoice.client.id);

          if (client) {
            if (
              oldInvoice.status !== "paid" &&
              updatedInvoice.status === "paid"
            ) {
              clientStore.updateClient(client.id, {
                revenue: (client.revenue || 0) + oldInvoice.total,
              });
            } else if (
              oldInvoice.status === "paid" &&
              updatedInvoice.status !== "paid"
            ) {
              clientStore.updateClient(client.id, {
                revenue: Math.max(0, (client.revenue || 0) - oldInvoice.total),
              });
            }
          }
        }
      },
      deleteInvoices: (ids) => {
        // Mise à jour des statistiques pour les factures payées supprimées
        const invoicesToDelete = get().invoices.filter((inv) =>
          ids.includes(inv.id)
        );
        const paidInvoices = invoicesToDelete.filter(
          (inv) => inv.status === "paid"
        );

        paidInvoices.forEach((invoice) => {
          useStatisticsStore
            .getState()
            .updateFromInvoice({ ...invoice, status: "draft" }, "paid");
        });

        // Mise à jour du chiffre d'affaires des clients
        if (paidInvoices.length > 0) {
          const clientStore = useClientStore.getState();
          const clientRevenues = new Map<string, number>();

          paidInvoices.forEach((invoice) => {
            const current = clientRevenues.get(invoice.client.id) || 0;
            clientRevenues.set(invoice.client.id, current + invoice.total);
          });

          clientRevenues.forEach((revenueToSubtract, clientId) => {
            const client = clientStore.getClientById(clientId);
            if (client) {
              clientStore.updateClient(clientId, {
                revenue: Math.max(0, (client.revenue || 0) - revenueToSubtract),
              });
            }
          });
        }

        set((state) => ({
          invoices: state.invoices.filter(
            (invoice) => !ids.includes(invoice.id)
          ),
        }));
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      generateInvoiceNumber: () => {
        const state = get();
        const { prefix } = state.settings;
        const year = format(new Date(), "yyyy");
        const month = format(new Date(), "MM");

        // Trouver le dernier numéro utilisé
        let maxNumber = state.settings.nextNumber;
        state.invoices.forEach((invoice) => {
          const match = invoice.number.match(/\d+$/);
          if (match) {
            const num = parseInt(match[0], 10);
            maxNumber = Math.max(maxNumber, num + 1);
          }
        });

        const paddedNumber = String(maxNumber).padStart(3, "0");

        // Mettre à jour le nextNumber dans les settings
        set((state) => ({
          settings: {
            ...state.settings,
            nextNumber: maxNumber + 1,
          },
        }));

        return `${prefix}-${year}-${month}-${paddedNumber}`;
      },
    }),
    {
      name: "invoices-storage",
    }
  )
);
