import React from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import type { SortOption } from '@/types';

interface ClientSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const ClientSort: React.FC<ClientSortProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="name-asc">Nom (A-Z)</option>
        <option value="name-desc">Nom (Z-A)</option>
        <option value="date-desc">Plus récent</option>
        <option value="date-asc">Plus ancien</option>
        <option value="revenue-desc">CA le plus élevé</option>
        <option value="revenue-asc">CA le plus bas</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};