"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const outline_1 = require("@heroicons/react/24/outline");
const themeStore_1 = require("@/store/themeStore");
const Button_1 = require("../Button");
const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = (0, themeStore_1.useThemeStore)();
    return ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", size: "sm", onClick: toggleTheme, className: "fixed bottom-4 right-4 z-50 !p-2 lg:!p-3 rounded-full shadow-lg", "aria-label": isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre', children: isDarkMode ? ((0, jsx_runtime_1.jsx)(outline_1.SunIcon, { className: "h-5 w-5 lg:h-6 lg:w-6" })) : ((0, jsx_runtime_1.jsx)(outline_1.MoonIcon, { className: "h-5 w-5 lg:h-6 lg:w-6" })) }));
};
exports.ThemeToggle = ThemeToggle;
