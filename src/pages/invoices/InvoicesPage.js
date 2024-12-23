"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PageHeader_1 = require("@/components/ui/PageHeader");
const Modal_1 = require("@/components/ui/Modal");
const InvoiceForm_1 = require("@/components/forms/InvoiceForm");
const InvoicesList_1 = require("@/components/invoices/InvoicesList");
const invoiceStore_1 = require("@/store/invoiceStore");
const clientStore_1 = require("@/store/clientStore");
const react_hot_toast_1 = require("react-hot-toast");
const SuccessAnimation_1 = require("@/components/animations/SuccessAnimation");
const InvoicesPage = () => {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [selectedInvoice, setSelectedInvoice] = (0, react_1.useState)(null);
    const [showSuccess, setShowSuccess] = (0, react_1.useState)(false);
    const { addInvoice, updateInvoice } = (0, invoiceStore_1.useInvoiceStore)();
    const { getClientById } = (0, clientStore_1.useClientStore)();
    const handleCreateInvoice = async (data) => {
        const client = getClientById(data.clientId);
        if (!client) {
            react_hot_toast_1.toast.error("Client introuvable");
            return;
        }
        try {
            const newInvoice = addInvoice({
                ...data,
                client,
            });
            setIsModalOpen(false);
            setShowSuccess(true);
            react_hot_toast_1.toast.success("Facture créée avec succès", {
                icon: "✨",
                duration: 5000,
            });
            return newInvoice;
        }
        catch (error) {
            react_hot_toast_1.toast.error("Erreur lors de la création de la facture");
            console.error(error);
        }
    };
    const handleUpdateInvoice = async (data) => {
        if (!selectedInvoice)
            return;
        const client = getClientById(data.clientId);
        if (!client) {
            react_hot_toast_1.toast.error("Client introuvable");
            return;
        }
        try {
            updateInvoice(selectedInvoice.id, {
                ...data,
                client,
            });
            setIsModalOpen(false);
            setSelectedInvoice(null);
            react_hot_toast_1.toast.success("Facture mise à jour avec succès", {
                icon: "✨",
                duration: 5000,
            });
        }
        catch (error) {
            react_hot_toast_1.toast.error("Erreur lors de la mise à jour de la facture");
            console.error(error);
        }
    };
    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900", children: [(0, jsx_runtime_1.jsx)(PageHeader_1.PageHeader, { title: "Factures", buttonText: "Nouvelle facture", onButtonClick: () => {
                    setSelectedInvoice(null);
                    setIsModalOpen(true);
                } }), (0, jsx_runtime_1.jsx)("div", { className: "max-w-screen-lg mx-auto", children: (0, jsx_runtime_1.jsx)(InvoicesList_1.InvoicesList, { onEdit: handleEdit }) }), (0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedInvoice(null);
                }, title: selectedInvoice ? "Modifier la facture" : "Nouvelle facture", children: (0, jsx_runtime_1.jsx)(InvoiceForm_1.InvoiceForm, { onSubmit: selectedInvoice ? handleUpdateInvoice : handleCreateInvoice, initialData: selectedInvoice || undefined }) }), (0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: showSuccess, onClose: () => setShowSuccess(false), title: "Facture cr\u00E9\u00E9e avec succ\u00E8s", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center py-6", children: [(0, jsx_runtime_1.jsx)(SuccessAnimation_1.SuccessAnimation, { className: "mb-4", onComplete: () => {
                                setTimeout(() => setShowSuccess(false), 1000);
                            } }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 text-center", children: "La facture a \u00E9t\u00E9 cr\u00E9\u00E9e avec succ\u00E8s !" })] }) })] }));
};
exports.InvoicesPage = InvoicesPage;
