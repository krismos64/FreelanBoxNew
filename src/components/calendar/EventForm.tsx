import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { CalendarEvent } from '@/types/calendar';

const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string(),
  start: z.string().min(1, 'La date de début est requise'),
  end: z.string().min(1, 'La date de fin est requise'),
  color: z.string().optional(),
  reminder: z.number().min(0).optional(),
  category: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<CalendarEvent>;
  isSubmitting?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Titre"
        {...register('title')}
        error={errors.title?.message}
      />
      <Input
        label="Description"
        {...register('description')}
        error={errors.description?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Début"
          type="datetime-local"
          {...register('start')}
          error={errors.start?.message}
        />
        <Input
          label="Fin"
          type="datetime-local"
          {...register('end')}
          error={errors.end?.message}
        />
      </div>
      <Input
        label="Catégorie"
        {...register('category')}
        error={errors.category?.message}
      />
      <Input
        label="Couleur"
        type="color"
        {...register('color')}
        error={errors.color?.message}
      />
      <Input
        label="Rappel (minutes avant)"
        type="number"
        {...register('reminder', { valueAsNumber: true })}
        error={errors.reminder?.message}
      />
      
      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          variant="gradient"
          isLoading={isSubmitting}
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};