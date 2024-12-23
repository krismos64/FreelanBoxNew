"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStats = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const chart_js_1 = require("chart.js");
const react_chartjs_2_1 = require("react-chartjs-2");
chart_js_1.Chart.register(chart_js_1.ArcElement, chart_js_1.Tooltip, chart_js_1.Legend);
const DocumentStats = ({ quotes, invoices, }) => {
    const quoteData = {
        labels: ['Brouillons', 'Envoyés', 'Acceptés', 'Refusés'],
        datasets: [
            {
                data: [
                    quotes.filter(q => q.status === 'draft').length,
                    quotes.filter(q => q.status === 'sent').length,
                    quotes.filter(q => q.status === 'accepted').length,
                    quotes.filter(q => q.status === 'rejected').length,
                ],
                backgroundColor: [
                    'rgba(156, 163, 175, 0.6)',
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(34, 197, 94, 0.6)',
                    'rgba(239, 68, 68, 0.6)',
                ],
                borderColor: [
                    'rgb(156, 163, 175)',
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 1,
            },
        ],
    };
    const invoiceData = {
        labels: ['Brouillons', 'Envoyées', 'En attente', 'Payées'],
        datasets: [
            {
                data: [
                    invoices.filter(i => i.status === 'draft').length,
                    invoices.filter(i => i.status === 'sent').length,
                    invoices.filter(i => i.status === 'pending').length,
                    invoices.filter(i => i.status === 'paid').length,
                ],
                backgroundColor: [
                    'rgba(156, 163, 175, 0.6)',
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(234, 179, 8, 0.6)',
                    'rgba(34, 197, 94, 0.6)',
                ],
                borderColor: [
                    'rgb(156, 163, 175)',
                    'rgb(59, 130, 246)',
                    'rgb(234, 179, 8)',
                    'rgb(34, 197, 94)',
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-6", children: "Statuts des devis" }), (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Pie, { data: quoteData, options: options })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-6", children: "Statuts des factures" }), (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Pie, { data: invoiceData, options: options })] })] }));
};
exports.DocumentStats = DocumentStats;
