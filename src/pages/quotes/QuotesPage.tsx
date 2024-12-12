import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { QuotesList } from "@/components/quotes/QuotesList";
import { useQuoteStore } from "@/store/quoteStore";
import { useClientStore } from "@/store/clientStore";
import { toast } from "react-hot-toast";
import { SuccessAnimation } from "@/components/animations/SuccessAnimation";
import type { Quote, QuoteFormData, QuoteItem } from "@/types/quote";

export const QuotesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addQuote, updateQuote } = useQuoteStore();
  const { getClientById } = useClientStore();

  useEffect(() => {
    const handleEditQuote = (event: CustomEvent<Quote>) => {
      setSelectedQuote(event.detail);
      setIsModalOpen(true);
    };

    window.addEventListener("editQuote", handleEditQuote as EventListener);

    return () => {
      window.removeEventListener("editQuote", handleEditQuote as EventListener);
    };
  }, []);

  const calculateItemTotal = (
    item: Omit<QuoteItem, "id" | "total">
  ): number => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return Number((quantity * unitPrice).toFixed(2));
  };

  const prepareQuoteItems = (
    items: Omit<QuoteItem, "id" | "total">[]
  ): QuoteItem[] => {
    return items.map((item) => ({
      ...item,
      id: item.id || crypto.randomUUID(),
      total: calculateItemTotal(item),
    }));
  };

  const generateQuoteNumber = () => {
    return `QUOTE-${Date.now()}`;
  };

  const handleCreateQuote = async (data: QuoteFormData) => {
    const client = getClientById(data.clientId);
    if (!client) {
      toast.error("Client introuvable");
      return;
    }

    try {
      const completeItems = prepareQuoteItems(data.items);
      const total = completeItems.reduce((sum, item) => sum + item.total, 0);

      const quoteData = {
        ...data,
        client,
        items: completeItems,
        total,
        status: "draft",
        date: new Date().toISOString(),
        number: generateQuoteNumber(),
      };

      const newQuote = addQuote(quoteData);

      setIsModalOpen(false);
      setShowSuccess(true);

      toast.success("Devis créé avec succès", {
        icon: "✨",
        duration: 5000,
      });

      return newQuote;
    } catch (error) {
      toast.error("Erreur lors de la création du devis");
      console.error(error);
    }
  };

  const handleUpdateQuote = async (data: QuoteFormData) => {
    if (!selectedQuote) return;

    const client = getClientById(data.clientId);
    if (!client) {
      toast.error("Client introuvable");
      return;
    }

    try {
      const completeItems = prepareQuoteItems(data.items);
      const total = completeItems.reduce((sum, item) => sum + item.total, 0);

      const updateData = {
        ...data,
        client,
        items: completeItems,
        total,
      };

      updateQuote(selectedQuote.id, updateData);

      setIsModalOpen(false);
      setSelectedQuote(null);

      toast.success("Devis mis à jour avec succès", {
        icon: "✨",
        duration: 5000,
      });
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du devis");
      console.error(error);
    }
  };

  return (
    <div className="p-6 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Devis"
        buttonText="Nouveau devis"
        onButtonClick={() => {
          setSelectedQuote(null);
          setIsModalOpen(true);
        }}
      />

      <div className="max-w-screen-lg mx-auto">
        <QuotesList />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuote(null);
        }}
        title={selectedQuote ? "Modifier le devis" : "Nouveau devis"}
      >
        <QuoteForm
          onSubmit={selectedQuote ? handleUpdateQuote : handleCreateQuote}
          initialData={selectedQuote || undefined}
        />
      </Modal>

      <Modal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Devis créé avec succès"
      >
        <div className="flex flex-col items-center py-6">
          <SuccessAnimation
            className="mb-4"
            onComplete={() => {
              setTimeout(() => setShowSuccess(false), 1000);
            }}
          />
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
            Le devis a été créé avec succès !
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default QuotesPage;
