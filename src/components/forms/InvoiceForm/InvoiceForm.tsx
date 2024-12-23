import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { ClientSelect } from "@/components/forms/shared/ClientSelect";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { invoiceSchema } from "./schema";
import type { InvoiceFormProps } from "./types";

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
  convertedFromQuote = false,
}) => {
  // Fonction pour obtenir la date du jour au format YYYY-MM-DD
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Fonction pour obtenir la date d'échéance (1 mois plus tard)
  const getDueDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      date: getCurrentDate(),
      dueDate: getDueDate(),
      termsAndConditions: "TVA non applicable, article 293 B du CGI.",
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const total =
    items?.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
      0
    ) || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ClientSelect
        label="Client"
        {...register("clientId")}
        error={errors.clientId?.message}
        disabled={convertedFromQuote}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          {...register("date")}
          error={errors.date?.message}
        />
        <Input
          label="Date d'échéance"
          type="date"
          {...register("dueDate")}
          error={errors.dueDate?.message}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Éléments de la facture
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              append({ description: "", quantity: 1, unitPrice: 0 })
            }
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter un élément
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-4 items-start bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div className="col-span-12 md:col-span-6">
              <Input
                label="Description"
                {...register(`items.${index}.description`)}
                error={errors.items?.[index]?.description?.message}
                multiline
                rows={2}
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <Input
                label="Quantité"
                type="number"
                min="1"
                {...register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                error={errors.items?.[index]?.quantity?.message}
              />
            </div>
            <div className="col-span-6 md:col-span-3">
              <Input
                label="Prix unitaire TTC"
                type="number"
                step="0.01"
                min="0"
                {...register(`items.${index}.unitPrice`, {
                  valueAsNumber: true,
                })}
                error={errors.items?.[index]?.unitPrice?.message}
              />
            </div>
            <div className="col-span-12 md:col-span-1 flex md:pt-7 justify-end">
              {index > 0 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Input
        label="Notes"
        {...register("notes")}
        error={errors.notes?.message}
        multiline
        rows={3}
      />

      <Input
        label="Conditions et mentions légales"
        {...register("termsAndConditions")}
        error={errors.termsAndConditions?.message}
        multiline
        rows={3}
      />

      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          Total TTC :{" "}
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(total)}
        </div>
        <div className="flex space-x-3">
          <Button type="submit" variant="gradient" isLoading={isSubmitting}>
            {initialData ? "Mettre à jour" : "Créer la facture"}
          </Button>
        </div>
      </div>
    </form>
  );
};
