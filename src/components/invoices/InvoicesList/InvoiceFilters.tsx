import React from "react";
import { Input } from "@/components/ui/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { InvoiceStatus } from "@/types/invoice";

interface InvoiceFiltersProps {
  filters: {
    search: string;
    status: string;
    dateRange: string;
  };
  onChange: (filters: any) => void;
}

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  filters,
  onChange,
}) => {
  const handleChange = (key: string, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const statuses: { value: InvoiceStatus | "all"; label: string }[] = [
    { value: "all", label: "Tous les statuts" },
    { value: "draft", label: "Brouillons" },
    { value: "sent", label: "Envoyées" },
    { value: "paid", label: "Payées" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          placeholder="Rechercher une facture..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
        className="block w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};
