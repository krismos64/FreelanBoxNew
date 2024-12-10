import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  clientId: z.string().min(1, 'Client is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.date(),
  endDate: z.date().optional(),
  rate: z.number().min(0, 'Rate must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']),
});