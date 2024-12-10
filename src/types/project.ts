export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  rate: number;
  currency: string;
}