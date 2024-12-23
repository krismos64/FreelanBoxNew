"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = require("@/components/ui/Button");
const outline_1 = require("@heroicons/react/24/outline");
const pdf_generator_1 = require("@/utils/pdf-generator");
const react_hot_toast_1 = require("react-hot-toast");
const companyStore_1 = require("@/store/companyStore");
const PDFButton = ({ document, type }) => {
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const company = (0, companyStore_1.useCompanyStore)((state) => state.company);
    const handleGeneratePDF = async () => {
        if (!company || !document) {
            react_hot_toast_1.toast.error("Informations manquantes pour générer le PDF");
            return;
        }
        try {
            setIsGenerating(true);
            const doc = type === "quote"
                ? (0, pdf_generator_1.generateQuotePDF)(document, company)
                : (0, pdf_generator_1.generateInvoicePDF)(document, company);
            doc.save(`${type === "quote" ? "devis" : "facture"}-${document.number}.pdf`);
            react_hot_toast_1.toast.success("PDF généré avec succès");
        }
        catch (error) {
            console.error("Erreur lors de la génération du PDF:", error);
            react_hot_toast_1.toast.error("Erreur lors de la génération du PDF");
        }
        finally {
            setIsGenerating(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "secondary", size: "sm", onClick: handleGeneratePDF, isLoading: isGenerating, disabled: !company || !document, children: [!isGenerating && (0, jsx_runtime_1.jsx)(outline_1.ArrowDownTrayIcon, { className: "h-4 w-4 mr-2" }), isGenerating ? "Génération..." : "Télécharger le PDF"] }));
};
exports.PDFButton = PDFButton;
