import React from 'react';
import { Button } from '@/components/ui/Button';
import { useQuoteStore } from '@/store/quoteStore';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { generateQuotePDF } from '@/utils/pdf-generator';
import { useCompanyStore } from '@/store/companyStore';
import type { Quote } from '@/types';

interface QuoteActionsProps {
  quote: Quote;
  onStatusChange: () => void;
  onConvertToInvoice: () => void;
}

export const QuoteActions: React.FC<QuoteActionsProps> = ({
  quote,
  onStatusChange,
  onConvertToInvoice,
}) => {
  const { updateQuote } = useQuoteStore();
  const { company } = useCompanyStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

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
      const doc = generateQuotePDF(quote, company);
      doc.save(`devis-${quote.number}.pdf`);
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

      {quote.status === 'sent' && (
        <>
          <Button
            variant="danger"
            size="sm"
            onClick={handleReject}
          >
            Refuser
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={handleAccept}
          >
            Accepter
          </Button>
        </>
      )}
      
      {quote.status === 'accepted' && !quote.convertedToInvoiceId && (
        <Button
          variant="gradient"
          size="sm"
          onClick={onConvertToInvoice}
        >
          Convertir en facture
        </Button>
      )}
    </div>
  );
};