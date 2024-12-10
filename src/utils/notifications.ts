import { toast } from 'react-hot-toast';
import type { CalendarEvent } from '@/types/calendar';
import { createElement } from 'react';
import { EventNotification } from '@/components/notifications/EventNotification';

export const checkAndNotifyEvents = (events: CalendarEvent[]) => {
  const now = new Date();
  
  events.forEach(event => {
    if (event.status !== 'upcoming' || !event.reminder) return;

    const reminderTime = new Date(event.start.getTime() - event.reminder * 60000);
    const timeDiff = reminderTime.getTime() - now.getTime();

    // If we're within 1 minute of the reminder time and haven't shown notification yet
    if (timeDiff >= 0 && timeDiff <= 60000) {
      showEventNotification(event);
    }
  });
};

const showEventNotification = (event: CalendarEvent) => {
  // Browser notification if permitted
  if (Notification.permission === 'granted') {
    new Notification('Rappel d\'événement', {
      body: `${event.title} commence dans ${event.reminder} minutes`,
    });
  }

  // Toast notification using the React component
  toast(
    createElement(EventNotification, {
      event,
      reminderMinutes: event.reminder || 0,
    }),
    {
      duration: 5000,
      icon: '🔔',
    }
  );
};

export const requestNotificationPermission = async () => {
  if (Notification.permission !== 'granted') {
    await Notification.requestPermission();
  }
};