export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color?: string;
  reminder?: number; // minutes before event
  category?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ReminderSettings {
  enabled: boolean;
  defaultTime: number; // minutes before event
  customTimes: number[]; // array of custom reminder times in minutes
}