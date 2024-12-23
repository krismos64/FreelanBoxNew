"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceActions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button_1 = require("@/components/ui/Button");
const PDFButton_1 = require("@/components/ui/PDFButton");
const invoiceStore_1 = require("@/store/invoiceStore");
const react_hot_toast_1 = require("react-hot-toast");
const InvoiceActions = ({ invoice, onStatusChange, onEdit, }) => {
    const { updateInvoice } = (0, invoiceStore_1.useInvoiceStore)();
    const handleStatusChange = (status) => {
        updateInvoice(invoice.id, { status });
        onStatusChange();
        const statusMessages = {
            sent: 'Facture marquée comme envoyée',
            pending: 'Facture en attente de paiement',
            paid: 'Facture marquée comme payée'
        };
        react_hot_toast_1.toast.success(statusMessages[status]);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(PDFButton_1.PDFButton, { document: invoice, type: "invoice" }), invoice.status === 'draft' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", size: "sm", onClick: () => handleStatusChange('sent'), children: "Marquer comme envoy\u00E9e" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", size: "sm", onClick: onEdit, children: "Modifier" })] })), invoice.status === 'sent' && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", size: "sm", onClick: () => handleStatusChange('pending'), children: "En attente de paiement" })), invoice.status === 'pending' && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "gradient", size: "sm", onClick: () => handleStatusChange('paid'), children: "Marquer comme pay\u00E9e" }))] }));
};
exports.InvoiceActions = InvoiceActions;
