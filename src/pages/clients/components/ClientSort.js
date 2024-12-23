"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSort = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const outline_1 = require("@heroicons/react/24/outline");
const ClientSort = ({ value, onChange }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("select", { value: value, onChange: (e) => onChange(e.target.value), className: "appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [(0, jsx_runtime_1.jsx)("option", { value: "name-asc", children: "Nom (A-Z)" }), (0, jsx_runtime_1.jsx)("option", { value: "name-desc", children: "Nom (Z-A)" }), (0, jsx_runtime_1.jsx)("option", { value: "date-desc", children: "Plus r\u00E9cent" }), (0, jsx_runtime_1.jsx)("option", { value: "date-asc", children: "Plus ancien" })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none", children: (0, jsx_runtime_1.jsx)(outline_1.ChevronUpDownIcon, { className: "h-5 w-5 text-gray-400" }) })] }));
};
exports.ClientSort = ClientSort;
