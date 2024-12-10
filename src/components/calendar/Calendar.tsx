import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { Modal } from "@/components/ui/Modal";
import { EventForm } from "./EventForm";
import { useCalendarStore } from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "react-hot-toast";
import type { CalendarEvent } from "@/types/calendar";

export const Calendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const { events, addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const { isDarkMode } = useThemeStore();

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setSelectedDates(null);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = (data: any) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, {
        ...data,
        start: new Date(data.start),
        end: new Date(data.end),
      });
      toast.success("Événement mis à jour");
    } else {
      addEvent({
        ...data,
        id: crypto.randomUUID(),
        start: new Date(data.start),
        end: new Date(data.end),
        status: "upcoming",
      });
      toast.success("Événement créé");
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDates(null);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      toast.success("Événement supprimé");
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <>
      <div
        className={`h-full rounded-xl shadow-lg p-4 transition-colors duration-200 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale={frLocale}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events.map((event) => ({
            ...event,
            start: new Date(event.start).toISOString(),
            end: new Date(event.end).toISOString(),
            className: `bg-primary-600 border-primary-700 text-white ${
              isDarkMode ? "hover:bg-primary-500" : "hover:bg-primary-700"
            }`,
          }))}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height="auto"
          themeSystem="standard"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSelectedDates(null);
        }}
        title={selectedEvent ? "Modifier l'événement" : "Nouvel événement"}
      >
        <EventForm
          onSubmit={handleSubmit}
          initialData={
            selectedEvent ||
            (selectedDates
              ? {
                  start: selectedDates.start.toISOString(),
                  end: selectedDates.end.toISOString(),
                }
              : undefined)
          }
          isSubmitting={false}
        />
      </Modal>
    </>
  );
};

function renderEventContent(eventInfo: any) {
  return (
    <div className="p-1">
      <div className="font-bold text-sm truncate">{eventInfo.event.title}</div>
      {eventInfo.event.extendedProps.description && (
        <div className="text-xs truncate opacity-90">
          {eventInfo.event.extendedProps.description}
        </div>
      )}
    </div>
  );
}
