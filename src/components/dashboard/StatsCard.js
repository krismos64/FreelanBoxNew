"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const themeStore_1 = require("@/store/themeStore");
const StatsCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
    const colorStyles = {
        blue: {
            icon: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        green: {
            icon: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/20',
        },
        purple: {
            icon: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
        },
        indigo: {
            icon: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        },
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-500 dark:text-gray-400 text-sm", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold mt-1 text-gray-900 dark:text-white", children: value }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-300 text-sm mt-1", children: subtitle })] }), (0, jsx_runtime_1.jsx)("div", { className: `${colorStyles[color].bg} p-3 rounded-full`, children: (0, jsx_runtime_1.jsx)("div", { className: colorStyles[color].icon, children: icon }) })] }) }));
};
exports.StatsCard = StatsCard;
