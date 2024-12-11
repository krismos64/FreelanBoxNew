import React from "react";
import { Button } from "./Button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { generateQuotePDF, generateInvoicePDF } from "@/utils/pdf-generator";
import { useCompanyStore } from "@/store/companyStore";
import type { Quote, Invoice } from "@/types";

interface PDFButtonProps {
  document: Quote | Invoice;
  type: "quote" | "invoice";
}

export const PDFButton: React.FC<PDFButtonProps> = ({ document, type }) => {
  const { company } = useCompanyStore();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const doc =
        type === "quote"
          ? generateQuotePDF(document as Quote, company)
          : generateInvoicePDF(document as Invoice, company);

      const number =
        type === "quote"
          ? (document as Quote).number
          : (document as Invoice).number;
      doc.save(`${type === "quote" ? "devis" : "facture"}-${number}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleDownload}
      isLoading={isGenerating}
    >
      {!isGenerating && <ArrowDownTrayIcon className="h-4 w-4 mr-2" />}
      {isGenerating ? "Génération..." : "Télécharger le PDF"}
    </Button>
  );
};
