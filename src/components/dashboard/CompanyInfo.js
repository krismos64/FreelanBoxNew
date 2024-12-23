"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyInfo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const themeStore_1 = require("@/store/themeStore");
const CompanyInfo = ({ onEdit }) => {
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Informations de l'entreprise" }), (0, jsx_runtime_1.jsx)("button", { onClick: onEdit, className: "px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300", children: "Modifier" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)(InfoRow, { label: "Nom", value: "-" }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Adresse", value: "-" }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Code postal", value: "-" }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Ville", value: "-" }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "T\u00E9l\u00E9phone", value: "-" }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Email", value: "-" }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Site web", value: "-" }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "SIRET", value: "-" })] })] }));
};
exports.CompanyInfo = CompanyInfo;
const InfoRow = ({ label, value }) => {
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-600 dark:text-gray-400", children: [label, " :"] }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-200", children: value })] }));
};
