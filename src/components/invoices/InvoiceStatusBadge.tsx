import React from 'react';
import type { InvoiceStatus } from '@/types/invoice';

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: {
    label: 'Brouillon',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  },
  sent: {
    label: 'Envoyée',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  pending: {
    label: 'En attente',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  },
  paid: {
    label: 'Payée',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
};