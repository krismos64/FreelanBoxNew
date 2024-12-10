import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatsSummary } from './components/StatsSummary';
import { RevenueCharts } from './components/RevenueCharts';
import { DocumentStats } from './components/DocumentStats';
import { StatisticsFilters } from './components/StatisticsFilters';
import { useStatisticsStore } from '@/store/statisticsStore';
import { useQuoteStore } from '@/store/quoteStore';
import { useInvoiceStore } from '@/store/invoiceStore';

export const StatisticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(new Date().getFullYear(), 0, 1), // Start of current year
    new Date()
  ]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const { monthlyRevenue, yearlyRevenue, totalRevenue, revenueHistory } = useStatisticsStore();
  const { quotes } = useQuoteStore();
  const { invoices } = useInvoiceStore();

  // Calcul des statistiques
  const totalQuotes = quotes.length;
  const totalInvoices = invoices.length;
  const acceptedQuotes = quotes.filter(quote => quote.status === 'accepted').length;
  const conversionRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;

  return (
    <div className="p-6">
      <PageHeader title="Statistiques" />

      <div className="space-y-6">
        {/* Filtres */}
        <StatisticsFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedClientId={selectedClientId}
          onClientChange={setSelectedClientId}
        />

        {/* Résumé des statistiques */}
        <StatsSummary
          totalRevenue={totalRevenue}
          totalInvoices={totalInvoices}
          totalQuotes={totalQuotes}
          conversionRate={conversionRate}
        />

        {/* Graphiques de revenus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueCharts
            monthlyData={revenueHistory}
            yearlyRevenue={yearlyRevenue}
            dateRange={dateRange}
          />
          <DocumentStats
            quotes={quotes}
            invoices={invoices}
          />
        </div>
      </div>
    </div>
  );
};