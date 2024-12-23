"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNotification = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const EventNotification = ({ event, reminderMinutes, visible, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { role: "alert", className: `flex items-start p-4 gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md
       ${visible
            ? "animate-in fade-in slide-in-from-top-2"
            : "animate-out fade-out slide-out-to-top-2"}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-blue-500", "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 dark:text-gray-100", children: event.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4", "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Commence dans ", reminderMinutes, " minutes"] })] })] })] }));
};
exports.EventNotification = EventNotification;
