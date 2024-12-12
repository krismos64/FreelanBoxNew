import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatsSummary } from "./components/StatsSummary";
import { RevenueCharts } from "./components/RevenueCharts";
import { DocumentStats } from "./components/DocumentStats";
import { StatisticsFilters } from "./components/StatisticsFilters";
import { useStatisticsStore } from "@/store/statisticsStore";
import { useQuoteStore } from "@/store/quoteStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";

export const StatisticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    startOfDay(new Date(new Date().getFullYear(), 0, 1)), // Start of current year
    endOfDay(new Date()),
  ]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const { monthlyRevenue, yearlyRevenue, totalRevenue, revenueHistory } =
    useStatisticsStore();
  const { quotes } = useQuoteStore();
  const { invoices } = useInvoiceStore();

  // Filtrer les factures et devis selon la période et le client
  const filteredData = useMemo(() => {
    const filterByDateAndClient = (items: any[]) => {
      return items.filter((item) => {
        try {
          const itemDate = item.date ? parseISO(item.date) : new Date();

          const withinInterval = isWithinInterval(itemDate, {
            start: startOfDay(dateRange[0]),
            end: endOfDay(dateRange[1]),
          });

          const meetsClientCriteria = selectedClientId
            ? item.client?.id === selectedClientId
            : true;

          return withinInterval && meetsClientCriteria;
        } catch (error) {
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
  const acceptedQuotes = filteredData.quotes.filter(
    (quote) => quote.status === "accepted"
  ).length;
  const conversionRate =
    totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;

  // Filtrer l'historique des revenus
  const filteredHistory = useMemo(() => {
    if (!selectedClientId) return revenueHistory;

    return revenueHistory.map((month) => ({
      ...month,
      amount: invoices
        .filter((invoice) => {
          try {
            return (
              invoice.status === "paid" &&
              invoice.client?.id === selectedClientId &&
              invoice.date.startsWith(month.month.slice(0, 7))
            );
          } catch (error) {
            console.error("Error filtering invoice:", error, invoice);
            return false;
          }
        })
        .reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0),
    }));
  }, [revenueHistory, invoices, selectedClientId]);

  return (
    <div className="p-6">
      <PageHeader title="Statistiques" />

      <div className="space-y-6">
        <StatisticsFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedClientId={selectedClientId}
          onClientChange={setSelectedClientId}
        />

        <StatsSummary
          totalRevenue={filteredData.revenue}
          totalInvoices={totalInvoices}
          totalQuotes={totalQuotes}
          conversionRate={conversionRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueCharts
            monthlyData={filteredHistory}
            yearlyRevenue={filteredData.revenue}
            dateRange={dateRange}
          />
          <DocumentStats
            quotes={filteredData.quotes}
            invoices={filteredData.invoices}
          />
        </div>
      </div>
    </div>
  );
};
