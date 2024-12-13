import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CalendarEvent } from "@/types/calendar";
import toast from "react-hot-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string(),
  start: z.string().min(1, "La date de début est requise"),
  end: z.string().min(1, "La date de fin est requise"),
  color: z.string().optional(),
  reminder: z.number().min(0).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onDelete?: (id: string) => void;
  initialData?: Partial<CalendarEvent>;
  isSubmitting?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onDelete,
  initialData,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData,
  });

  const handleDelete = () => {
    if (!initialData?.id) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      onDelete?.(initialData.id);
      toast.success("Événement supprimé");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Titre"
        {...register("title")}
        error={errors.title?.message}
      />
      <Input
        label="Description"
        {...register("description")}
        error={errors.description?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label="Début"
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("start")}
            error={errors.start?.message}
          />
        </div>
        <div className="relative">
          <Input
            label="Fin"
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("end")}
            error={errors.end?.message}
          />
        </div>
      </div>
      <Input
        label="Couleur"
        type="color"
        {...register("color")}
        error={errors.color?.message}
      />
      <Input
        label="Rappel (minutes avant)"
        type="number"
        {...register("reminder", { valueAsNumber: true })}
        error={errors.reminder?.message}
      />

      <div className="flex justify-end space-x-3">
        {initialData && onDelete && (
          <Button type="button" variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        )}
        <Button type="submit" variant="gradient" isLoading={isSubmitting}>
          {initialData ? "Mettre à jour" : "Créer"}
        </Button>
      </div>

      <style jsx global>{`
        input[type="datetime-local"] {
          position: relative;
          cursor: pointer;
          min-height: 38px;
          padding-right: 30px;
          color: inherit;
          background-color: inherit;
        }

        /* Styles pour le mode clair */
        input[type="datetime-local"] {
          font-size: 14px;
          line-height: 1.5;
        }

        /* Amélioration de l'apparence du sélecteur de date/heure */
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 8px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          background-color: transparent;
        }

        /* Styles pour le mode sombre */
        .dark input[type="datetime-local"] {
          color-scheme: dark;
        }

        .dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }

        .dark input[type="number"]::-webkit-inner-spin-button,
        .dark input[type="number"]::-webkit-outer-spin-button {
          filter: invert(1);
        }

        /* Assurer que le texte reste dans le cadre */
        input[type="datetime-local"],
        input[type="number"] {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      `}</style>
    </form>
  );
};
