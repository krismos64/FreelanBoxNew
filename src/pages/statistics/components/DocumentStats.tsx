import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { Quote, Invoice } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DocumentStatsProps {
  quotes: Quote[];
  invoices: Invoice[];
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({
  quotes,
  invoices,
}) => {
  const quoteData = {
    labels: ['Brouillons', 'Envoyés', 'Acceptés', 'Refusés'],
    datasets: [
      {
        data: [
          quotes.filter(q => q.status === 'draft').length,
          quotes.filter(q => q.status === 'sent').length,
          quotes.filter(q => q.status === 'accepted').length,
          quotes.filter(q => q.status === 'rejected').length,
        ],
        backgroundColor: [
          'rgba(156, 163, 175, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const invoiceData = {
    labels: ['Brouillons', 'Envoyées', 'En attente', 'Payées'],
    datasets: [
      {
        data: [
          invoices.filter(i => i.status === 'draft').length,
          invoices.filter(i => i.status === 'sent').length,
          invoices.filter(i => i.status === 'pending').length,
          invoices.filter(i => i.status === 'paid').length,
        ],
        backgroundColor: [
          'rgba(156, 163, 175, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(34, 197, 94, 0.6)',
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Statuts des devis
        </h3>
        <Pie data={quoteData} options={options} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Statuts des factures
        </h3>
        <Pie data={invoiceData} options={options} />
      </div>
    </div>
  );
};