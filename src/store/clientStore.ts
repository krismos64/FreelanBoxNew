import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/types";
import type { Invoice } from "@/types/invoice";

interface ClientStore {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClients: (ids: string[]) => void;
  getClientById: (id: string) => Client | undefined;
  updateClientRevenue: (
    clientId: string,
    invoice: Invoice,
    previousStatus: string | null
  ) => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],

      addClient: (client) =>
        set((state) => ({ clients: [...state.clients, client] })),

      updateClient: (id, updatedClient) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updatedClient } : client
          ),
        })),

      deleteClients: (ids) =>
        set((state) => ({
          clients: state.clients.filter((client) => !ids.includes(client.id)),
        })),

      getClientById: (id) => get().clients.find((client) => client.id === id),

      updateClientRevenue: (clientId, invoice, previousStatus) =>
        set((state) => ({
          clients: state.clients.map((client) => {
            if (client.id === clientId) {
              let newRevenue = client.revenue || 0;

              // Si la facture passe à "paid"
              if (previousStatus !== "paid" && invoice.status === "paid") {
                newRevenue += Number(invoice.total) || 0;
              }
              // Si la facture n'est plus "paid"
              else if (previousStatus === "paid" && invoice.status !== "paid") {
                newRevenue -= Number(invoice.total) || 0;
              }

              // S'assurer que le revenue ne devient pas négatif
              newRevenue = Math.max(0, newRevenue);

              return {
                ...client,
                revenue: newRevenue,
              };
            }
            return client;
          }),
        })),
    }),
    {
      name: "clients-storage",
    }
  )
);
