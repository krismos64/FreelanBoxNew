import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { generateInvoicePDF } from '@/utils/pdf-generator';
import { useCompanyStore } from '@/store/companyStore';
import type { Invoice } from '@/types';

interface InvoiceActionsProps {
  invoice: Invoice;
  onStatusChange: () => void;
}

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  invoice,
  onStatusChange,
}) => {
  const { company } = useCompanyStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = generateInvoicePDF(invoice, company);
      doc.save(`facture-${invoice.number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex justify-end space-x-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDownloadPDF}
        isLoading={isGeneratingPDF}
      >
        {!isGeneratingPDF && <ArrowDownTrayIcon className="h-4 w-4 mr-2" />}
        {isGeneratingPDF ? 'Génération...' : 'Télécharger'}
      </Button>
    </div>
  );
};