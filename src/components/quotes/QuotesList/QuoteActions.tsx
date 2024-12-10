import React from 'react';
import { Button } from '@/components/ui/Button';
import { PDFButton } from '@/components/ui/PDFButton';
import { useQuoteStore } from '@/store/quoteStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { addDays } from 'date-fns';
import { toast } from 'react-hot-toast';
import type { Quote } from '@/types/quote';

interface QuoteActionsProps {
  quote: Quote;
  onStatusChange: () => void;
  onEdit: () => void;
}

export const QuoteActions: React.FC<QuoteActionsProps> = ({
  quote,
  onStatusChange,
  onEdit,
}) => {
  const { updateQuote } = useQuoteStore();
  const { addInvoice, generateInvoiceNumber } = useInvoiceStore();

  const handleStatusChange = (status: Quote['status']) => {
    updateQuote(quote.id, { status });
    onStatusChange();
    
    const statusMessages = {
      sent: 'Devis marqué comme envoyé',
      accepted: 'Devis accepté',
      rejected: 'Devis refusé'
    };
    
    toast.success(statusMessages[status]);
  };

  const handleConvertToInvoice = () => {
    if (quote.status !== 'accepted') {
      toast.error('Seuls les devis acceptés peuvent être convertis en facture');
      return;
    }

    const invoice = {
      id: crypto.randomUUID(),
      number: generateInvoiceNumber(),
      date: new Date().toISOString(),
      dueDate: addDays(new Date(), 30).toISOString(),
      status: 'draft' as const,
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
    
    toast.success('Devis converti en facture avec succès');
  };

  return (
    <div className="flex justify-end space-x-2">
      <PDFButton
        document={quote}
        type="quote"
      />
      
      {quote.status === 'draft' && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleStatusChange('sent')}
          >
            Marquer comme envoyé
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onEdit}
          >
            Modifier
          </Button>
        </>
      )}
      
      {quote.status === 'sent' && (
        <>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleStatusChange('rejected')}
          >
            Refuser
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => handleStatusChange('accepted')}
          >
            Accepter
          </Button>
        </>
      )}
      
      {quote.status === 'accepted' && !quote.convertedToInvoiceId && (
        <Button
          variant="gradient"
          size="sm"
          onClick={handleConvertToInvoice}
        >
          Convertir en facture
        </Button>
      )}
    </div>
  );
};