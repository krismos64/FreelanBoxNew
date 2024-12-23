import React from "react";
import { Calendar, Clock } from "lucide-react";
import type { CalendarEvent } from "@/types/calendar";

interface EventNotificationProps {
  event: CalendarEvent;
  reminderMinutes: number;
  visible?: boolean;
}

export const EventNotification: React.FC<EventNotificationProps> = ({
  event,
  reminderMinutes,
  visible,
}) => {
  return (
    <div
      role="alert"
      className={`flex items-start p-4 gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md
       ${
         visible
           ? "animate-in fade-in slide-in-from-top-2"
           : "animate-out fade-out slide-out-to-top-2"
       }`}
    >
      <div className="shrink-0">
        <Calendar className="w-5 h-5 text-blue-500" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          {event.title}
        </h4>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" aria-hidden="true" />
          <span>Commence dans {reminderMinutes} minutes</span>
        </div>
      </div>
    </div>
  );
};
