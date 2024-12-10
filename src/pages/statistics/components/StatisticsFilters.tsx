import React from 'react';
import { ClientSelect } from '@/components/forms/shared/ClientSelect';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface StatisticsFiltersProps {
  dateRange: [Date, Date];
  onDateRangeChange: (range: [Date, Date]) => void;
  selectedClientId: string;
  onClientChange: (clientId: string) => void;
}

export const StatisticsFilters: React.FC<StatisticsFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  selectedClientId,
  onClientChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Période
          </label>
          <div className="flex space-x-4">
            <input
              type="date"
              value={format(dateRange[0], 'yyyy-MM-dd')}
              onChange={(e) => onDateRangeChange([new Date(e.target.value), dateRange[1]])}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            <input
              type="date"
              value={format(dateRange[1], 'yyyy-MM-dd')}
              onChange={(e) => onDateRangeChange([dateRange[0], new Date(e.target.value)])}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>

        <div>
          <ClientSelect
            label="Filtrer par client"
            value={selectedClientId}
            onChange={(e) => onClientChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};