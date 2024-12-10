import React from 'react';
import type { CalendarEvent } from '@/types/calendar';

interface EventNotificationProps {
  event: CalendarEvent;
  reminderMinutes: number;
}

export const EventNotification: React.FC<EventNotificationProps> = ({
  event,
  reminderMinutes,
}) => {
  return (
    <div className="flex flex-col">
      <strong className="text-gray-900 dark:text-gray-100">{event.title}</strong>
      <span className="text-gray-600 dark:text-gray-400">
        Commence dans {reminderMinutes} minutes
      </span>
    </div>
  );
};