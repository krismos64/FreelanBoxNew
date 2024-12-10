import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ClientSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ClientSearch: React.FC<ClientSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Rechercher un client..."
      />
    </div>
  );
};