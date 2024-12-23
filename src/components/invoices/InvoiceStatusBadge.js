"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceStatusBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const statusConfig = {
    draft: {
        label: "Brouillon",
        className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    },
    sent: {
        label: "Envoyée",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    pending: {
        label: "En attente",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
    paid: {
        label: "Payée",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
};
const InvoiceStatusBadge = ({ status = "draft", // Valeur par défaut
className = "", }) => {
    // Vérification de sécurité que le status existe dans la config
    const config = status && statusConfig[status] ? statusConfig[status] : statusConfig.draft;
    return ((0, jsx_runtime_1.jsx)("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`, children: config.label }));
};
exports.InvoiceStatusBadge = InvoiceStatusBadge;
