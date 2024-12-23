"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Table_1 = require("@/components/ui/Table");
const InvoiceStatusBadge_1 = require("../InvoiceStatusBadge");
const InvoiceActions_1 = require("./InvoiceActions");
const InvoiceFilters_1 = require("./InvoiceFilters");
const EmptyState_1 = require("@/components/animations/EmptyState");
const invoiceStore_1 = require("@/store/invoiceStore");
const Button_1 = require("@/components/ui/Button");
const outline_1 = require("@heroicons/react/24/outline");
const format_1 = require("@/utils/format");
const react_hot_toast_1 = require("react-hot-toast");
const InvoicesList = ({ onEdit }) => {
    const { invoices, deleteInvoices } = (0, invoiceStore_1.useInvoiceStore)();
    const [selectedInvoices, setSelectedInvoices] = (0, react_1.useState)([]);
    const [filters, setFilters] = (0, react_1.useState)({
        search: "",
        status: "all",
        dateRange: "all",
    });
    const generateInvoiceNumber = (index) => `INV-${Date.now()}-${index}`;
    const filteredInvoices = invoices
        .map((invoice, index) => {
        const items = invoice.items?.map((item) => ({
            ...item,
            total: Number(item.unitPrice || 0) * Number(item.quantity || 0),
        })) || [];
        const total = items.reduce((sum, item) => sum + item.total, 0);
        return {
            ...invoice,
            id: invoice.id || `temp-id-${index}`,
            number: invoice.number || generateInvoiceNumber(index),
            total,
            items,
        };
    })
        .filter((invoice) => {
        if (!invoice.client?.name) {
            console.warn(`Invoice ${invoice.number} has missing client data`);
            return false;
        }
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = searchTerm === "" ||
            invoice.number.toLowerCase().includes(searchTerm) ||
            invoice.client.name.toLowerCase().includes(searchTerm);
        const matchesStatus = filters.status === "all" || invoice.status === filters.status;
        return matchesSearch && matchesStatus;
    });
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedInvoices(filteredInvoices.map((invoice) => invoice.id));
        }
        else {
            setSelectedInvoices([]);
        }
    };
    const handleSelectInvoice = (id) => {
        setSelectedInvoices((prev) => prev.includes(id)
            ? prev.filter((invoiceId) => invoiceId !== id)
            : [...prev, id]);
    };
    const handleDelete = () => {
        if (selectedInvoices.length === 0)
            return;
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedInvoices.length} facture${selectedInvoices.length > 1 ? "s" : ""} ?`)) {
            deleteInvoices(selectedInvoices);
            setSelectedInvoices([]);
            react_hot_toast_1.toast.success(`${selectedInvoices.length} facture${selectedInvoices.length > 1 ? "s" : ""} supprimée${selectedInvoices.length > 1 ? "s" : ""}`);
        }
    };
    const columns = [
        {
            header: ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedInvoices.length === filteredInvoices.length, onChange: handleSelectAll, className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700" })),
            accessor: (invoice) => ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedInvoices.includes(invoice.id), onChange: () => handleSelectInvoice(invoice.id), onClick: (e) => e.stopPropagation(), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700" })),
            className: "w-12 hidden sm:table-cell",
        },
        {
            header: "Numéro",
            accessor: "number",
            className: "font-medium",
        },
        {
            header: "Client",
            accessor: (invoice) => invoice.client?.name ?? "Client inconnu",
            className: "hidden sm:table-cell",
        },
        {
            header: "Date",
            accessor: (invoice) => (0, format_1.formatDate)(invoice.date),
            className: "hidden md:table-cell",
        },
        {
            header: "Échéance",
            accessor: (invoice) => (0, format_1.formatDate)(invoice.dueDate),
            className: "hidden lg:table-cell",
        },
        {
            header: "Montant TTC",
            accessor: (invoice) => (0, format_1.formatCurrency)(invoice.total),
            className: "text-right",
        },
        {
            header: "Statut",
            accessor: (invoice) => (0, jsx_runtime_1.jsx)(InvoiceStatusBadge_1.InvoiceStatusBadge, { status: invoice.status }),
            className: "hidden sm:table-cell",
        },
        {
            header: "Actions",
            accessor: (invoice) => ((0, jsx_runtime_1.jsx)(InvoiceActions_1.InvoiceActions, { invoice: invoice, onEdit: () => onEdit(invoice), onStatusChange: () => {
                    // Refresh if needed
                } }, invoice.id)),
            className: "text-right",
        },
    ];
    const MobileInvoiceCard = ({ invoice }) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2 sm:hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: invoice.number }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: invoice.client?.name })] }), (0, jsx_runtime_1.jsx)(InvoiceStatusBadge_1.InvoiceStatusBadge, { status: invoice.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: (0, format_1.formatDate)(invoice.date) }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: (0, format_1.formatCurrency)(invoice.total) })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: invoice.items?.map((item) => ((0, jsx_runtime_1.jsxs)("div", { children: [item.description, ": ", (0, format_1.formatCurrency)(item.total)] }, item.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end pt-2", children: (0, jsx_runtime_1.jsx)(InvoiceActions_1.InvoiceActions, { invoice: invoice, onEdit: () => onEdit(invoice), onStatusChange: () => { } }) })] }));
    if (invoices.length === 0) {
        return ((0, jsx_runtime_1.jsx)(EmptyState_1.EmptyState, { message: "Aucune facture n'a encore \u00E9t\u00E9 cr\u00E9\u00E9e. Commencez par en cr\u00E9er une !", className: "mt-8" }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(InvoiceFilters_1.InvoiceFilters, { filters: filters, onChange: setFilters, className: "sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 p-4 -mx-4" }), selectedInvoices.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600 dark:text-gray-300", children: [selectedInvoices.length, " facture", selectedInvoices.length > 1 ? "s" : "", " s\u00E9lectionn\u00E9e", selectedInvoices.length > 1 ? "s" : ""] }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "danger", size: "sm", onClick: handleDelete, children: [(0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-4 w-4 mr-2" }), "Supprimer"] })] })), (0, jsx_runtime_1.jsx)("div", { className: "hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)(Table_1.Table, { columns: columns, data: filteredInvoices }) }), (0, jsx_runtime_1.jsx)("div", { className: "sm:hidden space-y-4", children: filteredInvoices.map((invoice) => ((0, jsx_runtime_1.jsx)(MobileInvoiceCard, { invoice: invoice }, invoice.id))) })] }));
};
exports.InvoicesList = InvoicesList;
