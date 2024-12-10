import React, { useState } from 'react';
import { Table } from '@/components/ui/Table';
import { QuoteStatusBadge } from '../QuoteStatusBadge';
import { QuoteActions } from './QuoteActions';
import { QuoteFilters } from './QuoteFilters';
import { EmptyState } from '@/components/animations/EmptyState';
import { useQuoteStore } from '@/store/quoteStore';
import { Button } from '@/components/ui/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { formatDate, formatCurrency } from '@/utils/format';
import { toast } from 'react-hot-toast';
import type { Quote } from '@/types/quote';

export const QuotesList: React.FC = () => {
  const { quotes, deleteQuotes } = useQuoteStore();
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
  });

  const filteredQuotes = quotes.filter(quote => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      quote.number.toLowerCase().includes(searchTerm) ||
      quote.client.name.toLowerCase().includes(searchTerm);
    
    const matchesStatus = filters.status === 'all' || quote.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedQuotes(filteredQuotes.map(quote => quote.id));
    } else {
      setSelectedQuotes([]);
    }
  };

  const handleSelectQuote = (id: string) => {
    setSelectedQuotes(prev => 
      prev.includes(id) 
        ? prev.filter(quoteId => quoteId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (selectedQuotes.length === 0) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedQuotes.length} devis ?`)) {
      deleteQuotes(selectedQuotes);
      setSelectedQuotes([]);
      toast.success(`${selectedQuotes.length} devis supprimé${selectedQuotes.length > 1 ? 's' : ''}`);
    }
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedQuotes.length === filteredQuotes.length}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
        />
      ),
      accessor: (quote: Quote) => (
        <input
          type="checkbox"
          checked={selectedQuotes.includes(quote.id)}
          onChange={() => handleSelectQuote(quote.id)}
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
      accessor: (quote: Quote) => quote.client.name
    },
    { 
      header: 'Date',
      accessor: (quote: Quote) => formatDate(quote.date)
    },
    { 
      header: 'Montant TTC',
      accessor: (quote: Quote) => formatCurrency(quote.total),
      className: 'text-right'
    },
    {
      header: 'Statut',
      accessor: (quote: Quote) => (
        <QuoteStatusBadge status={quote.status} />
      )
    },
    {
      header: 'Actions',
      accessor: (quote: Quote) => (
        <QuoteActions
          quote={quote}
          onStatusChange={() => {
            // Refresh if needed
          }}
          onEdit={() => {}}
        />
      ),
      className: 'text-right'
    }
  ];

  if (quotes.length === 0) {
    return (
      <EmptyState
        message="Aucun devis n'a encore été créé. Commencez par en créer un !"
        className="mt-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      <QuoteFilters
        filters={filters}
        onChange={setFilters}
      />

      {selectedQuotes.length > 0 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedQuotes.length} devis sélectionné{selectedQuotes.length > 1 ? 's' : ''}
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
          data={filteredQuotes}
        />
      </div>
    </div>
  );
};