"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = __importDefault(require("@fullcalendar/react"));
const daygrid_1 = __importDefault(require("@fullcalendar/daygrid"));
const timegrid_1 = __importDefault(require("@fullcalendar/timegrid"));
const interaction_1 = __importDefault(require("@fullcalendar/interaction"));
const fr_1 = __importDefault(require("@fullcalendar/core/locales/fr"));
const Modal_1 = require("@/components/ui/Modal");
const EventForm_1 = require("./EventForm");
const calendarStore_1 = require("@/store/calendarStore");
const themeStore_1 = require("@/store/themeStore");
const react_hot_toast_1 = require("react-hot-toast");
const Calendar = () => {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [selectedEvent, setSelectedEvent] = (0, react_1.useState)(null);
    const [selectedDates, setSelectedDates] = (0, react_1.useState)(null);
    const { events, addEvent, updateEvent, deleteEvent } = (0, calendarStore_1.useCalendarStore)();
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
    const handleDateSelect = (selectInfo) => {
        setSelectedDates({
            start: selectInfo.start,
            end: selectInfo.end,
        });
        setSelectedEvent(null);
        setIsModalOpen(true);
    };
    const handleEventClick = (clickInfo) => {
        const event = events.find((e) => e.id === clickInfo.event.id);
        if (event) {
            setSelectedEvent(event);
            setSelectedDates(null);
            setIsModalOpen(true);
        }
    };
    const handleSubmit = (data) => {
        if (selectedEvent) {
            updateEvent(selectedEvent.id, {
                ...data,
                start: new Date(data.start),
                end: new Date(data.end),
            });
            react_hot_toast_1.toast.success("Événement mis à jour");
        }
        else {
            addEvent({
                ...data,
                id: crypto.randomUUID(),
                start: new Date(data.start),
                end: new Date(data.end),
                status: "upcoming",
            });
            react_hot_toast_1.toast.success("Événement créé");
        }
        setIsModalOpen(false);
        setSelectedEvent(null);
        setSelectedDates(null);
    };
    const handleDelete = () => {
        if (selectedEvent) {
            deleteEvent(selectedEvent.id);
            react_hot_toast_1.toast.success("Événement supprimé");
            setIsModalOpen(false);
            setSelectedEvent(null);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: `h-full rounded-xl shadow-lg p-4 transition-colors duration-200 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`, children: [(0, jsx_runtime_1.jsx)("style", { children: isDarkMode &&
                            `
            /* Styles pour tous les modes */
            .fc-day, .fc-day-slot, .fc-timegrid-slot {
              background-color: rgb(31, 41, 55) !important; /* gray-900 */
            }
            .fc-day-today, .fc-timegrid-col.fc-day-today {
              background-color: rgba(59, 130, 246, 0.1) !important;
            }
            .fc td, .fc th {
              border-color: rgb(75, 85, 99) !important; /* gray-600 */
            }
            .fc-theme-standard .fc-scrollgrid {
              border-color: rgb(75, 85, 99) !important;
            }
            
            /* Styles spécifiques pour le mode jour */
            .fc-timegrid-slot-lane {
              background-color: rgb(31, 41, 55) !important;
            }
            .fc-timegrid-col {
              background-color: rgb(31, 41, 55) !important;
            }
            
            /* Amélioration de la visibilité du texte */
            .fc-daygrid-day-number,
            .fc-col-header-cell-cushion,
            .fc-timegrid-axis-cushion,
            .fc-timegrid-slot-label-cushion,
            .fc-daygrid-day-top {
              color: rgb(229, 231, 235) !important; /* gray-200 */
            }
            
            /* Gestion du débordement du texte */
            .fc-daygrid-event-harness {
              margin: 1px 0;
              max-height: 100%;
              overflow: hidden;
            }
            
            .fc-daygrid-event {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding: 2px 4px;
              margin: 1px 0;
            }
            
            .fc-daygrid-dot-event {
              padding: 2px 0;
            }
            
            /* Ajustement de la taille des cellules */
            .fc-daygrid-day-frame {
              min-height: 100%;
              display: flex;
              flex-direction: column;
            }
            
            .fc-daygrid-day-events {
              flex-grow: 1;
              overflow: hidden;
            }
            
            /* Style pour more links */
            .fc-daygrid-more-link {
              color: rgb(96, 165, 250) !important; /* blue-400 */
              font-weight: 500;
            }
          ` }), (0, jsx_runtime_1.jsx)(react_2.default, { plugins: [daygrid_1.default, timegrid_1.default, interaction_1.default], initialView: "dayGridMonth", headerToolbar: {
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }, locale: fr_1.default, selectable: true, selectMirror: true, dayMaxEvents: true, weekends: true, events: events.map((event) => ({
                            ...event,
                            start: new Date(event.start).toISOString(),
                            end: new Date(event.end).toISOString(),
                            className: `bg-primary-600 border-primary-700 text-white ${isDarkMode ? "hover:bg-primary-500" : "hover:bg-primary-700"}`,
                        })), select: handleDateSelect, eventClick: handleEventClick, eventContent: renderEventContent, height: "auto", themeSystem: "standard" })] }), (0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                    setSelectedDates(null);
                }, title: selectedEvent ? "Modifier l'événement" : "Nouvel événement", children: (0, jsx_runtime_1.jsx)(EventForm_1.EventForm, { onSubmit: handleSubmit, onDelete: handleDelete, initialData: selectedEvent ||
                        (selectedDates
                            ? {
                                start: selectedDates.start,
                                end: selectedDates.end,
                            }
                            : undefined), isSubmitting: false }) })] }));
};
exports.Calendar = Calendar;
function renderEventContent(eventInfo) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-bold text-sm truncate", children: eventInfo.event.title }), eventInfo.event.extendedProps.description && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs truncate opacity-90", children: eventInfo.event.extendedProps.description }))] }));
}
