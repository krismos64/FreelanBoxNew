import React, { useState } from "react";
import { Table } from "@/components/ui/Table";
import { InvoiceStatusBadge } from "../InvoiceStatusBadge";
import { InvoiceActions } from "./InvoiceActions";
import { InvoiceFilters } from "./InvoiceFilters";
import { EmptyState } from "@/components/animations/EmptyState";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDate, formatCurrency } from "@/utils/format";
import { toast } from "react-hot-toast";
import type { Invoice } from "@/types/invoice";

export const InvoicesList: React.FC = () => {
  const { invoices, deleteInvoices } = useInvoiceStore();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: "all",
  });

  const filteredInvoices = invoices.filter((invoice) => {
    if (!invoice.client?.name) {
      console.warn(`Invoice ${invoice.number} has missing client data`);
      return false;
    }
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      invoice.number.toLowerCase().includes(searchTerm) ||
      invoice.client.name.toLowerCase().includes(searchTerm);

    const matchesStatus =
      filters.status === "all" || invoice.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInvoices(filteredInvoices.map((invoice) => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (id: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(id)
        ? prev.filter((invoiceId) => invoiceId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (selectedInvoices.length === 0) return;

    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer ${selectedInvoices.length} facture${
          selectedInvoices.length > 1 ? "s" : ""
        } ?`
      )
    ) {
      deleteInvoices(selectedInvoices);
      setSelectedInvoices([]);
      toast.success(
        `${selectedInvoices.length} facture${
          selectedInvoices.length > 1 ? "s" : ""
        } supprimée${selectedInvoices.length > 1 ? "s" : ""}`
      );
    }
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedInvoices.length === filteredInvoices.length}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
        />
      ),
      accessor: (invoice: Invoice) => (
        <input
          type="checkbox"
          checked={selectedInvoices.includes(invoice.id)}
          onChange={() => handleSelectInvoice(invoice.id)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
        />
      ),
      className: "w-12 hidden sm:table-cell", // Masqué sur mobile
    },
    {
      header: "Numéro",
      accessor: "number",
      className: "font-medium",
    },
    {
      header: "Client",
      accessor: (invoice: Invoice) => invoice.client?.name ?? "Client inconnu",
      className: "hidden sm:table-cell", // Masqué sur mobile
    },
    {
      header: "Date",
      accessor: (invoice: Invoice) => formatDate(invoice.date),
      className: "hidden md:table-cell", // Masqué sur mobile et tablette
    },
    {
      header: "Échéance",
      accessor: (invoice: Invoice) => formatDate(invoice.dueDate),
      className: "hidden lg:table-cell", // Visible uniquement sur desktop
    },
    {
      header: "Montant TTC",
      accessor: (invoice: Invoice) => formatCurrency(invoice.total),
      className: "text-right",
    },
    {
      header: "Statut",
      accessor: (invoice: Invoice) => (
        <InvoiceStatusBadge status={invoice.status} />
      ),
      className: "hidden sm:table-cell", // Masqué sur mobile
    },
    {
      header: "Actions",
      accessor: (invoice: Invoice) => (
        <InvoiceActions
          invoice={invoice}
          onStatusChange={() => {
            // Refresh if needed
          }}
        />
      ),
      className: "text-right",
    },
  ];
  // Vue mobile pour chaque facture
  const MobileInvoiceCard = ({ invoice }: { invoice: Invoice }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2 sm:hidden">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{invoice.number}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {invoice.client?.name}
          </div>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(invoice.date)}
        </div>
        <div className="font-medium">{formatCurrency(invoice.total)}</div>
      </div>
      <div className="flex justify-end pt-2">
        <InvoiceActions invoice={invoice} onStatusChange={() => {}} />
      </div>
    </div>
  );

  if (invoices.length === 0) {
    return (
      <EmptyState
        message="Aucune facture n'a encore été créée. Commencez par en créer une !"
        className="mt-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      <InvoiceFilters
        filters={filters}
        onChange={setFilters}
        className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 p-4 -mx-4"
      />

      {selectedInvoices.length > 0 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedInvoices.length} facture
            {selectedInvoices.length > 1 ? "s" : ""} sélectionnée
            {selectedInvoices.length > 1 ? "s" : ""}
          </span>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      )}

      {/* Table pour tablette et desktop */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table columns={columns} data={filteredInvoices} />
      </div>

      {/* Cards pour mobile */}
      <div className="sm:hidden space-y-4">
        {filteredInvoices.map((invoice) => (
          <MobileInvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </div>
  );
};
