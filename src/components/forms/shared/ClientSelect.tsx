import React from 'react';
import { useClientStore } from '@/store/clientStore';

interface ClientSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const ClientSelect = React.forwardRef<HTMLSelectElement, ClientSelectProps>(
  ({ label, error, className, ...props }, ref) => {
    const { clients } = useClientStore();

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm 
            focus:border-primary-500 focus:ring-primary-500 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}`}
          {...props}
        >
          <option value="">Sélectionner un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.company ? `${client.company} (${client.name})` : client.name}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

ClientSelect.displayName = 'ClientSelect';