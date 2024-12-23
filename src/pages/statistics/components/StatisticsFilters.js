"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsFilters = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ClientSelect_1 = require("@/components/forms/shared/ClientSelect");
const date_fns_1 = require("date-fns");
const StatisticsFilters = ({ dateRange, onDateRangeChange, selectedClientId, onClientChange, }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "P\u00E9riode" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "date", value: (0, date_fns_1.format)(dateRange[0], "yyyy-MM-dd"), onChange: (e) => onDateRangeChange([new Date(e.target.value), dateRange[1]]), className: "block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: (0, date_fns_1.format)(dateRange[1], "yyyy-MM-dd"), onChange: (e) => onDateRangeChange([dateRange[0], new Date(e.target.value)]), className: "block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm" })] })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(ClientSelect_1.ClientSelect, { label: "Filtrer par client", value: selectedClientId, onChange: (e) => onClientChange(e.target.value) }) })] }) }));
};
exports.StatisticsFilters = StatisticsFilters;
