import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { generateQuotePDF, generateInvoicePDF } from "@/utils/pdf-generator";
import { toast } from "react-hot-toast";
import type { Quote, Invoice } from "@/types";
import { useCompanyStore } from "@/store/companyStore";

interface PDFButtonProps {
  document: Quote | Invoice;
  type: "quote" | "invoice";
}

export const PDFButton: React.FC<PDFButtonProps> = ({ document, type }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const company = useCompanyStore((state) => state.company);

  const handleGeneratePDF = async () => {
    if (!company || !document) {
      toast.error("Informations manquantes pour générer le PDF");
      return;
    }

    try {
      setIsGenerating(true);
      const doc =
        type === "quote"
          ? generateQuotePDF(document as Quote, company)
          : generateInvoicePDF(document as Invoice, company);

      doc.save(
        `${type === "quote" ? "devis" : "facture"}-${document.number}.pdf`
      );
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleGeneratePDF}
      isLoading={isGenerating}
      disabled={!company || !document}
    >
      {!isGenerating && <ArrowDownTrayIcon className="h-4 w-4 mr-2" />}
      {isGenerating ? "Génération..." : "Télécharger le PDF"}
    </Button>
  );
};
