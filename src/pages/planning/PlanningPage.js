"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PageHeader_1 = require("@/components/ui/PageHeader");
const Calendar_1 = require("@/components/calendar/Calendar");
const calendarStore_1 = require("@/store/calendarStore");
const notifications_1 = require("@/utils/notifications");
const PlanningPage = () => {
    const { events } = (0, calendarStore_1.useCalendarStore)();
    (0, react_1.useEffect)(() => {
        (0, notifications_1.requestNotificationPermission)();
        // Check for upcoming events every minute
        const interval = setInterval(() => {
            (0, notifications_1.checkAndNotifyEvents)(events);
        }, 60000);
        return () => clearInterval(interval);
    }, [events]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(PageHeader_1.PageHeader, { title: "Planning" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6", children: (0, jsx_runtime_1.jsx)(Calendar_1.Calendar, {}) })] }));
};
exports.PlanningPage = PlanningPage;
