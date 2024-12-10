import { z } from 'zod';
import { clientSchema } from './schema';

export type ClientFormData = z.infer<typeof clientSchema>;

export interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
  isSubmitting?: boolean;
}