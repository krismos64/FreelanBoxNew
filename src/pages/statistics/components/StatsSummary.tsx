import React from 'react';
import { 
  BanknotesIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/format';

interface StatsSummaryProps {
  totalRevenue: number;
  totalInvoices: number;
  totalQuotes: number;
  conversionRate: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  totalRevenue,
  totalInvoices,
  totalQuotes,
  conversionRate,
}) => {
  const stats = [
    {
      title: 'Chiffre d\'affaires total',
      value: formatCurrency(totalRevenue),
      icon: BanknotesIcon,
      color: 'text-primary-600 bg-primary-100 dark:bg-primary-900/20',
    },
    {
      title: 'Factures générées',
      value: totalInvoices.toString(),
      icon: DocumentTextIcon,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Devis réalisés',
      value: totalQuotes.toString(),
      icon: DocumentCheckIcon,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Taux de conversion',
      value: `${conversionRate.toFixed(1)}%`,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};