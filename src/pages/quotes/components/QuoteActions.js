"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteActions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Button_1 = require("@/components/ui/Button");
const quoteStore_1 = require("@/store/quoteStore");
const outline_1 = require("@heroicons/react/24/outline");
const pdf_generator_1 = require("@/utils/pdf-generator");
const companyStore_1 = require("@/store/companyStore");
const QuoteActions = ({ quote, onStatusChange, onConvertToInvoice, }) => {
    const { updateQuote } = (0, quoteStore_1.useQuoteStore)();
    const { company } = (0, companyStore_1.useCompanyStore)();
    const [isGeneratingPDF, setIsGeneratingPDF] = react_1.default.useState(false);
    const handleAccept = () => {
        updateQuote(quote.id, { status: 'accepted' });
        onStatusChange();
    };
    const handleReject = () => {
        updateQuote(quote.id, { status: 'rejected' });
        onStatusChange();
    };
    const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const doc = (0, pdf_generator_1.generateQuotePDF)(quote, company);
            doc.save(`devis-${quote.number}.pdf`);
        }
        catch (error) {
            console.error('Error generating PDF:', error);
        }
        finally {
            setIsGeneratingPDF(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3", children: [(0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "secondary", size: "sm", onClick: handleDownloadPDF, isLoading: isGeneratingPDF, children: [!isGeneratingPDF && (0, jsx_runtime_1.jsx)(outline_1.ArrowDownTrayIcon, { className: "h-4 w-4 mr-2" }), isGeneratingPDF ? 'Génération...' : 'Télécharger'] }), quote.status === 'sent' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "danger", size: "sm", onClick: handleReject, children: "Refuser" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "gradient", size: "sm", onClick: handleAccept, children: "Accepter" })] })), quote.status === 'accepted' && !quote.convertedToInvoiceId && ((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "gradient", size: "sm", onClick: onConvertToInvoice, children: "Convertir en facture" }))] }));
};
exports.QuoteActions = QuoteActions;
