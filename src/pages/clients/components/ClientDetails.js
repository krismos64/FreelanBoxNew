"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDetails = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = require("@/components/ui/Button");
const format_1 = require("@/utils/format");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const quoteStore_1 = require("@/store/quoteStore");
const invoiceStore_1 = require("@/store/invoiceStore");
const outline_1 = require("@heroicons/react/24/outline");
const ClientDetails = ({ client, onEdit, }) => {
    // Récupérer les listes de devis et factures depuis les stores
    const quotes = (0, quoteStore_1.useQuoteStore)((state) => state.quotes);
    const invoices = (0, invoiceStore_1.useInvoiceStore)((state) => state.invoices);
    // Calculer le nombre de documents pour ce client
    const documentCounts = (0, react_1.useMemo)(() => ({
        quotes: quotes.filter((quote) => quote.client.id === client.id).length,
        invoices: invoices.filter((invoice) => invoice.client.id === client.id)
            .length,
    }), [quotes, invoices, client.id]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [client.logo ? ((0, jsx_runtime_1.jsx)("img", { src: client.logo, alt: `Logo ${client.name}`, className: "w-16 h-16 rounded-lg object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl font-semibold text-gray-500 dark:text-gray-400", children: client.name.charAt(0).toUpperCase() }) })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: client.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Client depuis le", " ", (0, date_fns_1.format)(new Date(client.createdAt), "PP", { locale: locale_1.fr })] })] })] }), (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onEdit, variant: "secondary", size: "sm", children: "Modifier" })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(outline_1.BanknotesIcon, { className: "w-8 h-8" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-white/90", children: "Chiffre d'affaires total" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold", children: (0, format_1.formatCurrency)(client.revenue || 0) })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [(0, jsx_runtime_1.jsx)(InfoField, { label: "Email", value: client.email }), (0, jsx_runtime_1.jsx)(InfoField, { label: "T\u00E9l\u00E9phone", value: client.phone }), (0, jsx_runtime_1.jsx)(InfoField, { label: "Adresse", value: client.address }), (0, jsx_runtime_1.jsx)(InfoField, { label: "Code postal", value: client.postalCode }), (0, jsx_runtime_1.jsx)(InfoField, { label: "Ville", value: client.city }), (0, jsx_runtime_1.jsx)(InfoField, { label: "SIRET", value: client.siret })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Documents" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(DocumentCard, { icon: outline_1.DocumentTextIcon, title: "Devis", count: documentCounts.quotes }), (0, jsx_runtime_1.jsx)(DocumentCard, { icon: outline_1.DocumentIcon, title: "Factures", count: documentCounts.invoices })] })] })] }) }));
};
exports.ClientDetails = ClientDetails;
const InfoField = ({ label, value, }) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("dt", { className: "text-sm text-gray-500 dark:text-gray-400", children: label }), (0, jsx_runtime_1.jsx)("dd", { className: "mt-1 text-sm text-gray-900 dark:text-white", children: value || "-" })] }));
const DocumentCard = ({ icon: Icon, title, count }) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-gray-100 dark:bg-gray-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-5 h-5 text-gray-600 dark:text-gray-300" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [count, " document", count > 1 ? "s" : ""] })] })] }));
