"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PageHeader_1 = require("@/components/ui/PageHeader");
const Modal_1 = require("@/components/ui/Modal");
const QuoteForm_1 = require("@/components/forms/QuoteForm");
const QuotesList_1 = require("@/components/quotes/QuotesList");
const quoteStore_1 = require("@/store/quoteStore");
const clientStore_1 = require("@/store/clientStore");
const react_hot_toast_1 = require("react-hot-toast");
const SuccessAnimation_1 = require("@/components/animations/SuccessAnimation");
const QuotesPage = () => {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [selectedQuote, setSelectedQuote] = (0, react_1.useState)(null);
    const [showSuccess, setShowSuccess] = (0, react_1.useState)(false);
    const { addQuote, updateQuote } = (0, quoteStore_1.useQuoteStore)();
    const { getClientById } = (0, clientStore_1.useClientStore)();
    (0, react_1.useEffect)(() => {
        const handleEditQuote = (event) => {
            setSelectedQuote(event.detail);
            setIsModalOpen(true);
        };
        window.addEventListener("editQuote", handleEditQuote);
        return () => {
            window.removeEventListener("editQuote", handleEditQuote);
        };
    }, []);
    const calculateItemTotal = (item) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        return Number((quantity * unitPrice).toFixed(2));
    };
    const prepareQuoteItems = (items) => {
        return items.map((item) => ({
            ...item,
            id: item.id || crypto.randomUUID(),
            total: calculateItemTotal(item),
        }));
    };
    const generateQuoteNumber = () => {
        return `QUOTE-${Date.now()}`;
    };
    const handleCreateQuote = async (data) => {
        const client = getClientById(data.clientId);
        if (!client) {
            react_hot_toast_1.toast.error("Client introuvable");
            return;
        }
        try {
            const completeItems = prepareQuoteItems(data.items);
            const total = completeItems.reduce((sum, item) => sum + item.total, 0);
            const quoteData = {
                ...data,
                client,
                items: completeItems,
                total,
                status: "draft",
                date: new Date().toISOString(),
                number: generateQuoteNumber(),
            };
            const newQuote = addQuote(quoteData);
            setIsModalOpen(false);
            setShowSuccess(true);
            react_hot_toast_1.toast.success("Devis créé avec succès", {
                icon: "✨",
                duration: 5000,
            });
            return newQuote;
        }
        catch (error) {
            react_hot_toast_1.toast.error("Erreur lors de la création du devis");
            console.error(error);
        }
    };
    const handleUpdateQuote = async (data) => {
        if (!selectedQuote)
            return;
        const client = getClientById(data.clientId);
        if (!client) {
            react_hot_toast_1.toast.error("Client introuvable");
            return;
        }
        try {
            const completeItems = prepareQuoteItems(data.items);
            const total = completeItems.reduce((sum, item) => sum + item.total, 0);
            const updateData = {
                ...data,
                client,
                items: completeItems,
                total,
            };
            updateQuote(selectedQuote.id, updateData);
            setIsModalOpen(false);
            setSelectedQuote(null);
            react_hot_toast_1.toast.success("Devis mis à jour avec succès", {
                icon: "✨",
                duration: 5000,
            });
        }
        catch (error) {
            react_hot_toast_1.toast.error("Erreur lors de la mise à jour du devis");
            console.error(error);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900", children: [(0, jsx_runtime_1.jsx)(PageHeader_1.PageHeader, { title: "Devis", buttonText: "Nouveau devis", onButtonClick: () => {
                    setSelectedQuote(null);
                    setIsModalOpen(true);
                } }), (0, jsx_runtime_1.jsx)("div", { className: "max-w-screen-lg mx-auto", children: (0, jsx_runtime_1.jsx)(QuotesList_1.QuotesList, {}) }), (0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedQuote(null);
                }, title: selectedQuote ? "Modifier le devis" : "Nouveau devis", children: (0, jsx_runtime_1.jsx)(QuoteForm_1.QuoteForm, { onSubmit: selectedQuote ? handleUpdateQuote : handleCreateQuote, initialData: selectedQuote || undefined }) }), (0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: showSuccess, onClose: () => setShowSuccess(false), title: "Devis cr\u00E9\u00E9 avec succ\u00E8s", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center py-6", children: [(0, jsx_runtime_1.jsx)(SuccessAnimation_1.SuccessAnimation, { className: "mb-4", onComplete: () => {
                                setTimeout(() => setShowSuccess(false), 1000);
                            } }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 text-center", children: "Le devis a \u00E9t\u00E9 cr\u00E9\u00E9 avec succ\u00E8s !" })] }) })] }));
};
exports.QuotesPage = QuotesPage;
exports.default = exports.QuotesPage;
