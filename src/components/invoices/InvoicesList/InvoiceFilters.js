"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceFilters = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const outline_1 = require("@heroicons/react/24/outline");
const InvoiceFilters = ({ filters, onChange, }) => {
    const handleChange = (key, value) => {
        onChange({ ...filters, [key]: value });
    };
    const statuses = [
        { value: "all", label: "Tous les statuts" },
        { value: "draft", label: "Brouillons" },
        { value: "sent", label: "Envoyées" },
        { value: "paid", label: "Payées" },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(outline_1.MagnifyingGlassIcon, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: filters.search, onChange: (e) => handleChange("search", e.target.value), placeholder: "Rechercher une facture...", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" })] }), (0, jsx_runtime_1.jsx)("select", { value: filters.status, onChange: (e) => handleChange("status", e.target.value), className: "block w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: statuses.map((status) => ((0, jsx_runtime_1.jsx)("option", { value: status.value, children: status.label }, status.value))) })] }));
};
exports.InvoiceFilters = InvoiceFilters;
