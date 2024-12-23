"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCalendarStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useCalendarStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
    events: [],
    reminderSettings: {
        enabled: true,
        defaultTime: 10, // 10 minutes before
        customTimes: [5, 10, 30, 60], // 5min, 10min, 30min, 1h
    },
    addEvent: (event) => set((state) => ({
        events: [...state.events, event],
    })),
    updateEvent: (id, updatedEvent) => set((state) => ({
        events: state.events.map((event) => event.id === id ? { ...event, ...updatedEvent } : event),
    })),
    deleteEvent: (id) => set((state) => ({
        events: state.events.filter((event) => event.id !== id),
    })),
    updateReminderSettings: (settings) => set((state) => ({
        reminderSettings: { ...state.reminderSettings, ...settings },
    })),
}), {
    name: 'calendar-storage',
}));
