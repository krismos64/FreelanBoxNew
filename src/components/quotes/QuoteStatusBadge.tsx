import React from 'react';
import type { QuoteStatus } from '@/types/quote';

const statusConfig: Record<QuoteStatus, { label: string; className: string }> = {
  draft: {
    label: 'Brouillon',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  },
  sent: {
    label: 'Envoyé',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  accepted: {
    label: 'Accepté',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  rejected: {
    label: 'Refusé',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
};

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
  className?: string;
}

export const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
};