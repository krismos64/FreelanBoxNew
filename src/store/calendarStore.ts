import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarEvent, ReminderSettings } from '@/types/calendar';

interface CalendarStore {
  events: CalendarEvent[];
  reminderSettings: ReminderSettings;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      events: [],
      reminderSettings: {
        enabled: true,
        defaultTime: 10, // 10 minutes before
        customTimes: [5, 10, 30, 60], // 5min, 10min, 30min, 1h
      },
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
      updateReminderSettings: (settings) =>
        set((state) => ({
          reminderSettings: { ...state.reminderSettings, ...settings },
        })),
    }),
    {
      name: 'calendar-storage',
    }
  )
);