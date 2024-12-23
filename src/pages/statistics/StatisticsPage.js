"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PageHeader_1 = require("@/components/ui/PageHeader");
const StatsSummary_1 = require("./components/StatsSummary");
const RevenueCharts_1 = require("./components/RevenueCharts");
const DocumentStats_1 = require("./components/DocumentStats");
const StatisticsFilters_1 = require("./components/StatisticsFilters");
const statisticsStore_1 = require("@/store/statisticsStore");
const quoteStore_1 = require("@/store/quoteStore");
const invoiceStore_1 = require("@/store/invoiceStore");
const date_fns_1 = require("date-fns");
const StatisticsPage = () => {
    const [dateRange, setDateRange] = (0, react_1.useState)([
        (0, date_fns_1.startOfDay)(new Date(new Date().getFullYear(), 0, 1)), // Start of current year
        (0, date_fns_1.endOfDay)(new Date()),
    ]);
    const [selectedClientId, setSelectedClientId] = (0, react_1.useState)("");
    const { monthlyRevenue, yearlyRevenue, totalRevenue, revenueHistory } = (0, statisticsStore_1.useStatisticsStore)();
    const { quotes } = (0, quoteStore_1.useQuoteStore)();
    const { invoices } = (0, invoiceStore_1.useInvoiceStore)();
    // Filtrer les factures et devis selon la période et le client
    const filteredData = (0, react_1.useMemo)(() => {
        const filterByDateAndClient = (items) => {
            return items.filter((item) => {
                try {
                    const itemDate = item.date ? (0, date_fns_1.parseISO)(item.date) : new Date();
                    const withinInterval = (0, date_fns_1.isWithinInterval)(itemDate, {
                        start: (0, date_fns_1.startOfDay)(dateRange[0]),
                        end: (0, date_fns_1.endOfDay)(dateRange[1]),
                    });
                    const meetsClientCriteria = selectedClientId
                        ? item.client?.id === selectedClientId
                        : true;
                    return withinInterval && meetsClientCriteria;
                }
                catch (error) {
                    console.error("Error filtering item:", error, item);
                    return false;
                }
            });
        };
        const filteredQuotes = filterByDateAndClient(quotes);
        const filteredInvoices = filterByDateAndClient(invoices);
        // Calculer le chiffre d'affaires filtré
        const filteredRevenue = filteredInvoices
            .filter((invoice) => invoice.status === "paid")
            .reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0);
        return {
            quotes: filteredQuotes,
            invoices: filteredInvoices,
            revenue: filteredRevenue,
        };
    }, [quotes, invoices, dateRange, selectedClientId]);
    // Calculer les statistiques filtrées
    const totalQuotes = filteredData.quotes.length;
    const totalInvoices = filteredData.invoices.length;
    const acceptedQuotes = filteredData.quotes.filter((quote) => quote.status === "accepted").length;
    const conversionRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;
    // Filtrer l'historique des revenus
    const filteredHistory = (0, react_1.useMemo)(() => {
        if (!selectedClientId)
            return revenueHistory;
        return revenueHistory.map((month) => ({
            ...month,
            amount: invoices
                .filter((invoice) => {
                try {
                    return (invoice.status === "paid" &&
                        invoice.client?.id === selectedClientId &&
                        invoice.date.startsWith(month.month.slice(0, 7)));
                }
                catch (error) {
                    console.error("Error filtering invoice:", error, invoice);
                    return false;
                }
            })
                .reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0),
        }));
    }, [revenueHistory, invoices, selectedClientId]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(PageHeader_1.PageHeader, { title: "Statistiques" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(StatisticsFilters_1.StatisticsFilters, { dateRange: dateRange, onDateRangeChange: setDateRange, selectedClientId: selectedClientId, onClientChange: setSelectedClientId }), (0, jsx_runtime_1.jsx)(StatsSummary_1.StatsSummary, { totalRevenue: filteredData.revenue, totalInvoices: totalInvoices, totalQuotes: totalQuotes, conversionRate: conversionRate }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(RevenueCharts_1.RevenueCharts, { monthlyData: filteredHistory, yearlyRevenue: filteredData.revenue, dateRange: dateRange }), (0, jsx_runtime_1.jsx)(DocumentStats_1.DocumentStats, { quotes: filteredData.quotes, invoices: filteredData.invoices })] })] })] }));
};
exports.StatisticsPage = StatisticsPage;
