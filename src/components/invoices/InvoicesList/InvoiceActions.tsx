import React from 'react';
import { Button } from '@/components/ui/Button';
import { PDFButton } from '@/components/ui/PDFButton';
import { useInvoiceStore } from '@/store/invoiceStore';
import { toast } from 'react-hot-toast';
import type { Invoice } from '@/types/invoice';

interface InvoiceActionsProps {
  invoice: Invoice;
  onStatusChange: () => void;
  onEdit: () => void;
}

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  invoice,
  onStatusChange,
  onEdit,
}) => {
  const { updateInvoice } = useInvoiceStore();

  const handleStatusChange = (status: Invoice['status']) => {
    updateInvoice(invoice.id, { status });
    onStatusChange();
    
    const statusMessages = {
      sent: 'Facture marquée comme envoyée',
      pending: 'Facture en attente de paiement',
      paid: 'Facture marquée comme payée'
    };
    
    toast.success(statusMessages[status]);
  };

  return (
    <div className="flex justify-end space-x-2">
      <PDFButton
        document={invoice}
        type="invoice"
      />
      
      {invoice.status === 'draft' && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleStatusChange('sent')}
          >
            Marquer comme envoyée
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
      
      {invoice.status === 'sent' && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleStatusChange('pending')}
        >
          En attente de paiement
        </Button>
      )}
      
      {invoice.status === 'pending' && (
        <Button
          variant="gradient"
          size="sm"
          onClick={() => handleStatusChange('paid')}
        >
          Marquer comme payée
        </Button>
      )}
    </div>
  );
};