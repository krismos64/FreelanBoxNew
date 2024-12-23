"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChecklistStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useChecklistStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
    items: [],
    addItem: (title) => set((state) => ({
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
    updateItem: (id, updates) => set((state) => ({
        items: state.items.map((item) => item.id === id ? { ...item, ...updates } : item),
    })),
    deleteItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
    })),
    toggleItem: (id) => set((state) => ({
        items: state.items.map((item) => item.id === id ? { ...item, completed: !item.completed } : item),
    })),
    reorderItems: (newItems) => set(() => ({
        items: newItems,
    })),
}), {
    name: "checklist-storage",
}));
