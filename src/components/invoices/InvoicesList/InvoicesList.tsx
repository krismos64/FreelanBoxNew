import React, { useState } from 'react';
import { Table } from '@/components/ui/Table';
import { InvoiceStatusBadge } from '../InvoiceStatusBadge';
import { InvoiceActions } from './InvoiceActions';
import { InvoiceFilters } from './InvoiceFilters';
import { EmptyState } from '@/components/animations/EmptyState';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Button } from '@/components/ui/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { formatDate, formatCurrency } from '@/utils/format';
import { toast } from 'react-hot-toast';
import type { Invoice } from '@/types/invoice';

export const InvoicesList: React.FC = () => {
  const { invoices, deleteInvoices } = useInvoiceStore();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
  });

  const filteredInvoices = invoices.filter(invoice => {
    if (!invoice.client?.name) {
      console.warn(`Invoice ${invoice.number} has missing client data`);
      return false;
    }
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      invoice.number.toLowerCase().includes(searchTerm) ||
      invoice.client.name.toLowerCase().includes(searchTerm);
    
    const matchesStatus = filters.status === 'all' || invoice.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (id: string) => {
    setSelectedInvoices(prev => 
      prev.includes(id) 
        ? prev.filter(invoiceId => invoiceId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (selectedInvoices.length === 0) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedInvoices.length} facture${selectedInvoices.length > 1 ? 's' : ''} ?`)) {
      deleteInvoices(selectedInvoices);
      setSelectedInvoices([]);
      toast.success(`${selectedInvoices.length} facture${selectedInvoices.length > 1 ? 's' : ''} supprimée${selectedInvoices.length > 1 ? 's' : ''}`);
    }
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedInvoices.length === filteredInvoices.length}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
        />
      ),
      accessor: (invoice: Invoice) => (
        <input
          type="checkbox"
          checked={selectedInvoices.includes(invoice.id)}
          onChange={() => handleSelectInvoice(invoice.id)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
        />
      ),
      className: 'w-12'
    },
    { 
      header: 'Numéro',
      accessor: 'number',
      className: 'font-medium'
    },
    { 
      header: 'Client',
      accessor: (invoice: Invoice) => invoice.client?.name ?? 'Client inconnu'
    },
    { 
      header: 'Date',
      accessor: (invoice: Invoice) => formatDate(invoice.date)
    },
    { 
      header: 'Échéance',
      accessor: (invoice: Invoice) => formatDate(invoice.dueDate)
    },
    { 
      header: 'Montant TTC',
      accessor: (invoice: Invoice) => formatCurrency(invoice.total),
      className: 'text-right'
    },
    {
      header: 'Statut',
      accessor: (invoice: Invoice) => (
        <InvoiceStatusBadge status={invoice.status} />
      )
    },
    {
      header: 'Actions',
      accessor: (invoice: Invoice) => (
        <InvoiceActions
          invoice={invoice}
          onStatusChange={() => {
            // Refresh if needed
          }}
        />
      ),
      className: 'text-right'
    }
  ];

  if (invoices.length === 0) {
    return (
      <EmptyState
        message="Aucune facture n'a encore été créée. Commencez par en créer une !"
        className="mt-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      <InvoiceFilters
        filters={filters}
        onChange={setFilters}
      />

      {selectedInvoices.length > 0 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedInvoices.length} facture{selectedInvoices.length > 1 ? 's' : ''} sélectionnée{selectedInvoices.length > 1 ? 's' : ''}
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table
          columns={columns}
          data={filteredInvoices}
        />
      </div>
    </div>
  );
};