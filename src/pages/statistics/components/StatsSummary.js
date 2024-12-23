"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsSummary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const outline_1 = require("@heroicons/react/24/outline");
const format_1 = require("@/utils/format");
const StatsSummary = ({ totalRevenue, totalInvoices, totalQuotes, conversionRate, }) => {
    const stats = [
        {
            title: 'Chiffre d\'affaires total',
            value: (0, format_1.formatCurrency)(totalRevenue),
            icon: outline_1.BanknotesIcon,
            color: 'text-primary-600 bg-primary-100 dark:bg-primary-900/20',
        },
        {
            title: 'Factures générées',
            value: totalInvoices.toString(),
            icon: outline_1.DocumentTextIcon,
            color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
        },
        {
            title: 'Devis réalisés',
            value: totalQuotes.toString(),
            icon: outline_1.DocumentCheckIcon,
            color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
        },
        {
            title: 'Taux de conversion',
            value: `${conversionRate.toFixed(1)}%`,
            icon: outline_1.ArrowTrendingUpIcon,
            color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
        },
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((stat) => ((0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: `p-3 rounded-lg ${stat.color}`, children: (0, jsx_runtime_1.jsx)(stat.icon, { className: "w-6 h-6" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: stat.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold text-gray-900 dark:text-white", children: stat.value })] })] }) }, stat.title))) }));
};
exports.StatsSummary = StatsSummary;
