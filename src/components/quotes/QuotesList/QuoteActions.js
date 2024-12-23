"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteActions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button_1 = require("@/components/ui/Button");
const PDFButton_1 = require("@/components/ui/PDFButton");
const quoteStore_1 = require("@/store/quoteStore");
const invoiceStore_1 = require("@/store/invoiceStore");
const date_fns_1 = require("date-fns");
const react_hot_toast_1 = require("react-hot-toast");
const QuoteActions = ({ quote, onStatusChange, onEdit, }) => {
    const { updateQuote } = (0, quoteStore_1.useQuoteStore)();
    const { addInvoice, generateInvoiceNumber } = (0, invoiceStore_1.useInvoiceStore)();
    const handleStatusChange = (status) => {
        updateQuote(quote.id, { status });
        onStatusChange();
        const statusMessages = {
            sent: 'Devis marqué comme envoyé',
            accepted: 'Devis accepté',
            rejected: 'Devis refusé'
        };
        react_hot_toast_1.toast.success(statusMessages[status]);
    };
    const handleConvertToInvoice = () => {
        if (quote.status !== 'accepted') {
            react_hot_toast_1.toast.error('Seuls les devis acceptés peuvent être convertis en facture');
            return;
        }
        const invoice = {
            id: crypto.randomUUID(),
            number: generateInvoiceNumber(),
            date: new Date().toISOString(),
            dueDate: (0, date_fns_1.addDays)(new Date(), 30).toISOString(),
            status: 'draft',
            client: quote.client,
            items: quote.items,
            total: quote.total,
            notes: quote.notes,
            termsAndConditions: quote.termsAndConditions,
            convertedFromQuoteId: quote.id,
            quote,
        };
        addInvoice(invoice);
        updateQuote(quote.id, {
            convertedToInvoiceId: invoice.id,
        });
        react_hot_toast_1.toast.success('Devis converti en facture avec succès');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(PDFButton_1.PDFButton, { document: quote, type: "quote" }), quote.status === 'draft' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", size: "sm", onClick: () => handleStatusChange('sent'), children: "Marquer comme envoy\u00E9" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", size: "sm", onClick: onEdit, children: "Modifier" })] })), quote.status === 'sent' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "danger", size: "sm", onClick: () => handleStatusChange('rejected'), children: "Refuser" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "gradient", size: "sm", onClick: () => handleStatusChange('accepted'), children: "Accepter" })] })), quote.status === 'accepted' && !quote.convertedToInvoiceId && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "gradient", size: "sm", onClick: handleConvertToInvoice, children: "Convertir en facture" }))] }));
};
exports.QuoteActions = QuoteActions;
