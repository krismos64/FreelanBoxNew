"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Table_1 = require("@/components/ui/Table");
const QuoteStatusBadge_1 = require("../QuoteStatusBadge");
const QuoteActions_1 = require("./QuoteActions");
const QuoteFilters_1 = require("./QuoteFilters");
const EmptyState_1 = require("@/components/animations/EmptyState");
const quoteStore_1 = require("@/store/quoteStore");
const Button_1 = require("@/components/ui/Button");
const outline_1 = require("@heroicons/react/24/outline");
const format_1 = require("@/utils/format");
const react_hot_toast_1 = require("react-hot-toast");
const QuotesList = () => {
    const { quotes, deleteQuotes } = (0, quoteStore_1.useQuoteStore)();
    const [selectedQuotes, setSelectedQuotes] = (0, react_1.useState)([]);
    const [filters, setFilters] = (0, react_1.useState)({
        search: "",
        status: "all",
        dateRange: "all",
    });
    // Logique de filtrage
    const filteredQuotes = quotes.filter((quote) => {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = searchTerm === "" ||
            quote.number.toLowerCase().includes(searchTerm) ||
            quote.client.name.toLowerCase().includes(searchTerm);
        const matchesStatus = filters.status === "all" || quote.status === filters.status;
        return matchesSearch && matchesStatus;
    });
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedQuotes(filteredQuotes.map((quote) => quote.id));
        }
        else {
            setSelectedQuotes([]);
        }
    };
    const handleSelectQuote = (id) => {
        setSelectedQuotes((prev) => prev.includes(id)
            ? prev.filter((quoteId) => quoteId !== id)
            : [...prev, id]);
    };
    const handleDelete = () => {
        if (selectedQuotes.length === 0)
            return;
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedQuotes.length} devis ?`)) {
            deleteQuotes(selectedQuotes);
            setSelectedQuotes([]);
            react_hot_toast_1.toast.success(`${selectedQuotes.length} devis supprimé${selectedQuotes.length > 1 ? "s" : ""}`);
        }
    };
    const handleEdit = (quote) => {
        if (typeof window !== "undefined") {
            const event = new CustomEvent("editQuote", { detail: quote });
            window.dispatchEvent(event);
        }
    };
    // Colonnes adaptatives
    const columns = [
        {
            header: ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedQuotes.length === filteredQuotes.length, onChange: handleSelectAll, className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700" })),
            accessor: (quote) => ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedQuotes.includes(quote.id), onChange: () => handleSelectQuote(quote.id), onClick: (e) => e.stopPropagation(), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700" })),
            className: "w-12 hidden sm:table-cell",
        },
        {
            header: "Numéro",
            accessor: "number",
            className: "font-medium",
        },
        {
            header: "Client",
            accessor: (quote) => quote.client.name,
            className: "hidden sm:table-cell",
        },
        {
            header: "Date",
            accessor: (quote) => (0, format_1.formatDate)(quote.date),
            className: "hidden md:table-cell",
        },
        {
            header: "Montant TTC",
            accessor: (quote) => (0, format_1.formatCurrency)(quote.total),
            className: "text-right",
        },
        {
            header: "Statut",
            accessor: (quote) => (0, jsx_runtime_1.jsx)(QuoteStatusBadge_1.QuoteStatusBadge, { status: quote.status }),
            className: "hidden sm:table-cell",
        },
        {
            header: "Actions",
            accessor: (quote) => ((0, jsx_runtime_1.jsx)(QuoteActions_1.QuoteActions, { quote: quote, onStatusChange: () => { }, onEdit: () => handleEdit(quote) })),
            className: "text-right",
        },
    ];
    const MobileQuoteCard = ({ quote }) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2 sm:hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: quote.number }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: quote.client.name })] }), (0, jsx_runtime_1.jsx)(QuoteStatusBadge_1.QuoteStatusBadge, { status: quote.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: (0, format_1.formatDate)(quote.date) }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: (0, format_1.formatCurrency)(quote.total) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end pt-2", children: (0, jsx_runtime_1.jsx)(QuoteActions_1.QuoteActions, { quote: quote, onStatusChange: () => { }, onEdit: () => handleEdit(quote) }) })] }));
    if (quotes.length === 0) {
        return ((0, jsx_runtime_1.jsx)(EmptyState_1.EmptyState, { message: "Aucun devis n'a encore \u00E9t\u00E9 cr\u00E9\u00E9. Commencez par en cr\u00E9er un !", className: "mt-8" }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(QuoteFilters_1.QuoteFilters, { filters: filters, onChange: setFilters, className: "sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 p-4 -mx-4" }), selectedQuotes.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600 dark:text-gray-300", children: [selectedQuotes.length, " devis s\u00E9lectionn\u00E9", selectedQuotes.length > 1 ? "s" : ""] }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "danger", size: "sm", onClick: handleDelete, children: [(0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-4 w-4 mr-2" }), "Supprimer"] })] })), (0, jsx_runtime_1.jsx)("div", { className: "hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)(Table_1.Table, { columns: columns, data: filteredQuotes }) }), (0, jsx_runtime_1.jsx)("div", { className: "sm:hidden space-y-4", children: filteredQuotes.map((quote) => ((0, jsx_runtime_1.jsx)(MobileQuoteCard, { quote: quote }, quote.id))) })] }));
};
exports.QuotesList = QuotesList;
