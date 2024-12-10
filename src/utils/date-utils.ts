import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const getFormattedDate = (): string => {
  return format(new Date(), "dd MMMM yyyy", { locale: fr });
};

export const formatDateRange = (start: Date, end: Date): string => {
  return `${format(start, 'HH:mm', { locale: fr })} - ${format(end, 'HH:mm', { locale: fr })}`;
};

export const formatFullDateTime = (date: Date): string => {
  return format(date, "dd MMMM yyyy 'à' HH:mm", { locale: fr });
};

export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: fr });
};