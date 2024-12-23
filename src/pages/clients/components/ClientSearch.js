"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSearch = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const outline_1 = require("@heroicons/react/24/outline");
const ClientSearch = ({ value, onChange }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(outline_1.MagnifyingGlassIcon, { className: "h-5 w-5 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), className: "block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent", placeholder: "Rechercher un client..." })] }));
};
exports.ClientSearch = ClientSearch;
