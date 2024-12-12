import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/types";

interface ClientStore {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClients: (ids: string[]) => void;
  getClientById: (id: string) => Client | undefined;
  updateClientRevenue: (clientId: string, revenue: number) => void;
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
      updateClientRevenue: (clientId, revenue) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, revenue: (client.revenue || 0) + revenue }
              : client
          ),
        })),
    }),
    {
      name: "clients-storage",
    }
  )
);
