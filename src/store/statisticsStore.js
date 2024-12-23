"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStatisticsStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
exports.useStatisticsStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    totalRevenue: 0,
    revenueHistory: [],
    updateFromInvoice: (invoice, previousStatus) => {
        const currentDate = new Date();
        const invoiceDate = new Date(invoice.date);
        const isCurrentMonth = (0, date_fns_1.startOfMonth)(invoiceDate).getTime() ===
            (0, date_fns_1.startOfMonth)(currentDate).getTime();
        const isCurrentYear = (0, date_fns_1.startOfYear)(invoiceDate).getTime() ===
            (0, date_fns_1.startOfYear)(currentDate).getTime();
        const monthKey = (0, date_fns_1.format)(invoiceDate, "MMMM yyyy", { locale: locale_1.fr });
        set((state) => {
            let newMonthlyRevenue = state.monthlyRevenue;
            let newYearlyRevenue = state.yearlyRevenue;
            let newTotalRevenue = state.totalRevenue;
            let newHistory = [...state.revenueHistory];
            // Si la facture devient payée
            if (previousStatus !== "paid" && invoice.status === "paid") {
                if (isCurrentMonth)
                    newMonthlyRevenue += invoice.total;
                if (isCurrentYear)
                    newYearlyRevenue += invoice.total;
                newTotalRevenue += invoice.total;
                const existingMonth = newHistory.find((item) => item.month === monthKey);
                if (existingMonth) {
                    newHistory = newHistory.map((item) => item.month === monthKey
                        ? { ...item, amount: item.amount + invoice.total }
                        : item);
                }
                else {
                    newHistory.push({ month: monthKey, amount: invoice.total });
                }
            }
            // Si la facture n'est plus payée
            else if (previousStatus === "paid" && invoice.status !== "paid") {
                if (isCurrentMonth)
                    newMonthlyRevenue = Math.max(0, newMonthlyRevenue - invoice.total);
                if (isCurrentYear)
                    newYearlyRevenue = Math.max(0, newYearlyRevenue - invoice.total);
                newTotalRevenue = Math.max(0, newTotalRevenue - invoice.total);
                newHistory = newHistory.map((item) => item.month === monthKey
                    ? { ...item, amount: Math.max(0, item.amount - invoice.total) }
                    : item);
            }
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
    recalculateAll: () => {
        // Cette fonction sera appelée au démarrage pour recalculer toutes les statistiques
        // à partir des factures existantes
    },
}), {
    name: "statistics-storage",
}));
