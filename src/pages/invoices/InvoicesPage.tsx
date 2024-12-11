import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { InvoicesList } from "@/components/invoices/InvoicesList";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useClientStore } from "@/store/clientStore";
import { toast } from "react-hot-toast";
import { SuccessAnimation } from "@/components/animations/SuccessAnimation";
import type { Invoice, InvoiceFormData } from "@/types/invoice";

export const InvoicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addInvoice, updateInvoice } = useInvoiceStore();
  const { getClientById } = useClientStore();

  const handleCreateInvoice = async (data: InvoiceFormData) => {
    const client = getClientById(data.clientId);
    if (!client) {
      toast.error("Client introuvable");
      return;
    }

    try {
      const newInvoice = addInvoice({
        ...data,
        client,
      });
      setIsModalOpen(false);
      setShowSuccess(true);

      toast.success("Facture créée avec succès", {
        icon: "✨",
        duration: 5000,
      });
      return newInvoice;
    } catch (error) {
      toast.error("Erreur lors de la création de la facture");
      console.error(error);
    }
  };

  const handleUpdateInvoice = async (data: InvoiceFormData) => {
    if (!selectedInvoice) return;

    const client = getClientById(data.clientId);
    if (!client) {
      toast.error("Client introuvable");
      return;
    }

    try {
      updateInvoice(selectedInvoice.id, {
        ...data,
        client,
      });
      setIsModalOpen(false);
      setSelectedInvoice(null);

      toast.success("Facture mise à jour avec succès", {
        icon: "✨",
        duration: 5000,
      });
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la facture");
      console.error(error);
    }
  };

  return (
    <div className="p-6 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Factures"
        buttonText="Nouvelle facture"
        onButtonClick={() => {
          setSelectedInvoice(null);
          setIsModalOpen(true);
        }}
      />

      <div className="max-w-screen-lg mx-auto">
        <InvoicesList />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInvoice(null);
        }}
        title={selectedInvoice ? "Modifier la facture" : "Nouvelle facture"}
      >
        <InvoiceForm
          onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}
          initialData={selectedInvoice || undefined}
        />
      </Modal>

      <Modal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Facture créée avec succès"
      >
        <div className="flex flex-col items-center py-6">
          <SuccessAnimation
            className="mb-4"
            onComplete={() => {
              setTimeout(() => setShowSuccess(false), 1000);
            }}
          />
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
            La facture a été créée avec succès !
          </p>
        </div>
      </Modal>
    </div>
  );
};
