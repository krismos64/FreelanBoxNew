"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = Table;
const jsx_runtime_1 = require("react/jsx-runtime");
const themeStore_1 = require("@/store/themeStore");
function Table({ columns, data, onRowClick }) {
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
    return ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50 dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)("tr", { children: columns.map((column, index) => ((0, jsx_runtime_1.jsx)("th", { className: `px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.className}`, children: column.header }, index))) }) }), (0, jsx_runtime_1.jsxs)("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: [data.map((item, rowIndex) => ((0, jsx_runtime_1.jsx)("tr", { onClick: () => onRowClick?.(item), className: `${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''} 
                ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`, children: columns.map((column, colIndex) => ((0, jsx_runtime_1.jsx)("td", { className: `px-6 py-4 whitespace-nowrap ${column.className}`, children: typeof column.accessor === 'function'
                                    ? column.accessor(item)
                                    : String(item[column.accessor]) }, colIndex))) }, rowIndex))), data.length === 0 && ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: columns.length, className: "px-6 py-4 text-center text-gray-500 dark:text-gray-400", children: "Aucune donn\u00E9e disponible" }) }))] })] }) }));
}
