import React, { useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Calendar } from '@/components/calendar/Calendar';
import { useCalendarStore } from '@/store/calendarStore';
import { checkAndNotifyEvents, requestNotificationPermission } from '@/utils/notifications';

export const PlanningPage = () => {
  const { events } = useCalendarStore();

  useEffect(() => {
    requestNotificationPermission();
    
    // Check for upcoming events every minute
    const interval = setInterval(() => {
      checkAndNotifyEvents(events);
    }, 60000);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="p-6">
      <PageHeader title="Planning" />
      <div className="mt-6">
        <Calendar />
      </div>
    </div>
  );
};