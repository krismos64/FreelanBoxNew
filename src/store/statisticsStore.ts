import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfMonth, startOfYear, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Invoice } from '@/types';

interface RevenueHistoryItem {
  month: string;
  amount: number;
}

interface StatisticsStore {
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalRevenue: number;
  revenueHistory: RevenueHistoryItem[];
  updateFromInvoice: (invoice: Invoice, previousStatus?: string) => void;
}

export const useStatisticsStore = create<StatisticsStore>()(
  persist(
    (set, get) => ({
      monthlyRevenue: 0,
      yearlyRevenue: 0,
      totalRevenue: 0,
      revenueHistory: [],

      updateFromInvoice: (invoice: Invoice, previousStatus?: string) => {
        const currentDate = new Date();
        const invoiceDate = new Date(invoice.date);
        const isCurrentMonth = startOfMonth(invoiceDate).getTime() === startOfMonth(currentDate).getTime();
        const isCurrentYear = startOfYear(invoiceDate).getTime() === startOfYear(currentDate).getTime();
        const monthKey = format(invoiceDate, 'MMMM yyyy', { locale: fr });

        set(state => {
          let newMonthlyRevenue = state.monthlyRevenue;
          let newYearlyRevenue = state.yearlyRevenue;
          let newTotalRevenue = state.totalRevenue;
          let newHistory = [...state.revenueHistory];

          // Si la facture passe de non payée à payée
          if (previousStatus !== 'paid' && invoice.status === 'paid') {
            if (isCurrentMonth) newMonthlyRevenue += invoice.total;
            if (isCurrentYear) newYearlyRevenue += invoice.total;
            newTotalRevenue += invoice.total;

            // Mise à jour de l'historique
            const existingMonth = newHistory.find(item => item.month === monthKey);
            if (existingMonth) {
              newHistory = newHistory.map(item =>
                item.month === monthKey
                  ? { ...item, amount: item.amount + invoice.total }
                  : item
              );
            } else {
              newHistory.push({ month: monthKey, amount: invoice.total });
            }
          }
          // Si la facture passe de payée à non payée
          else if (previousStatus === 'paid' && invoice.status !== 'paid') {
            if (isCurrentMonth) newMonthlyRevenue = Math.max(0, newMonthlyRevenue - invoice.total);
            if (isCurrentYear) newYearlyRevenue = Math.max(0, newYearlyRevenue - invoice.total);
            newTotalRevenue = Math.max(0, newTotalRevenue - invoice.total);

            // Mise à jour de l'historique
            newHistory = newHistory.map(item =>
              item.month === monthKey
                ? { ...item, amount: Math.max(0, item.amount - invoice.total) }
                : item
            );
          }

          // Tri de l'historique par date
          newHistory.sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
          });

          return {
            monthlyRevenue: newMonthlyRevenue,
            yearlyRevenue: newYearlyRevenue,
            totalRevenue: newTotalRevenue,
            revenueHistory: newHistory,
          };
        });
      },
    }),
    {
      name: 'statistics-storage',
    }
  )
);