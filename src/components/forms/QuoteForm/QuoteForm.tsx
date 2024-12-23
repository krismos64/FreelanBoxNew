import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { ClientSelect } from "@/components/forms/shared/ClientSelect";
import {
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { quoteSchema } from "./schema";
import { addMonths } from "date-fns";
import type { QuoteFormProps } from "./types";

export const QuoteForm: React.FC<QuoteFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      clientId: initialData?.client?.id || "",
      items: initialData?.items || [
        { description: "", quantity: 1, unitPrice: 0 },
      ],
      date: initialData?.date || new Date().toISOString().split("T")[0],
      validUntil:
        initialData?.validUntil ||
        addMonths(new Date(), 1).toISOString().split("T")[0],
      notes: initialData?.notes || "",
      termsAndConditions:
        initialData?.termsAndConditions ||
        "TVA non applicable, article 293 B du CGI.",
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

  const handleUnitPriceChange = (index: number, change: number) => {
    const currentPrice = items[index].unitPrice || 0;
    setValue(`items.${index}.unitPrice`, Math.max(0, currentPrice + change));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <ClientSelect
          label="Client"
          {...register("clientId")}
          error={errors.clientId?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date d'émission"
            type="date"
            {...register("date")}
            error={errors.date?.message}
          />
          <Input
            label="Date de validité"
            type="date"
            {...register("validUntil")}
            error={errors.validUntil?.message}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Produits / Services
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
            Ajouter une ligne
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
              <div className="flex items-start space-x-2">
                <div className="flex-1">
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
                <div className="flex flex-col pt-7 space-y-1">
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    onClick={() => handleUnitPriceChange(index, 100)}
                  >
                    <ChevronUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    onClick={() => handleUnitPriceChange(index, -100)}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
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

      <div className="space-y-4">
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
      </div>

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
            {initialData ? "Mettre à jour" : "Créer le devis"}
          </Button>
        </div>
      </div>
    </form>
  );
};
