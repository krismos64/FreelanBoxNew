import React, { useState } from "react";
import { Table } from "@/components/ui/Table";
import { formatDate, formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Client } from "@/types";

interface ClientsTableProps {
  clients: Client[];
  onRowClick: (client: Client) => void;
  onDelete: (ids: string[]) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onRowClick,
  onDelete,
}) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedClients(clients.map((client) => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id)
        ? prev.filter((clientId) => clientId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (selectedClients.length > 0) {
      onDelete(selectedClients);
      setSelectedClients([]);
    }
  };

  const ClientLogo: React.FC<{ client: Client }> = ({ client }) => {
    const containerClasses = "w-20 h-20 flex-shrink-0 relative overflow-hidden";

    if (client.logo) {
      return (
        <div
          className={`${containerClasses} bg-gray-50 dark:bg-gray-900 rounded-lg`}
        >
          <img
            src={client.logo}
            alt={`Logo ${client.name}`}
            className="w-full h-full object-contain p-2"
          />
        </div>
      );
    }

    return (
      <div
        className={`${containerClasses} rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
      >
        <span className="text-2xl font-medium text-gray-500 dark:text-gray-400">
          {client.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedClients.length === clients.length}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
        />
      ),
      accessor: (client: Client) => (
        <input
          type="checkbox"
          checked={selectedClients.includes(client.id)}
          onChange={() => handleSelectClient(client.id)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
        />
      ),
      className: "w-12",
    },
    {
      header: "",
      accessor: (client: Client) => <ClientLogo client={client} />,
      className: "w-24 px-4",
    },
    {
      header: "Nom",
      accessor: "name",
      className: "font-medium",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Téléphone",
      accessor: (client: Client) => client.phone || "-",
    },
    {
      header: "Ville",
      accessor: (client: Client) => client.city || "-",
    },
    {
      header: "Chiffre d'affaires",
      accessor: (client: Client) => formatCurrency(client.revenue || 0),
      className: "text-right font-medium",
    },
    {
      header: "Date de création",
      accessor: (client: Client) => formatDate(client.createdAt),
    },
  ];

  return (
    <div className="space-y-4">
      {selectedClients.length > 0 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedClients.length} client
            {selectedClients.length > 1 ? "s" : ""} sélectionné
            {selectedClients.length > 1 ? "s" : ""}
          </span>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table columns={columns} data={clients} onRowClick={onRowClick} />
      </div>
    </div>
  );
};
