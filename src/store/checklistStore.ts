import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface ChecklistStore {
  items: ChecklistItem[];
  addItem: (title: string) => void;
  updateItem: (id: string, updates: Partial<ChecklistItem>) => void;
  deleteItem: (id: string) => void;
  toggleItem: (id: string) => void;
  reorderItems: (newItems: ChecklistItem[]) => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (title) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          ),
        })),
      reorderItems: (newItems) =>
        set(() => ({
          items: newItems,
        })),
    }),
    {
      name: "checklist-storage",
    }
  )
);
