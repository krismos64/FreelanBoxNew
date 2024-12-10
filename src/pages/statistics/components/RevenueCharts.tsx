import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '@/utils/format';
import { useThemeStore } from '@/store/themeStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartsProps {
  monthlyData: Array<{ month: string; amount: number }>;
  yearlyRevenue: number;
  dateRange: [Date, Date];
}

export const RevenueCharts: React.FC<RevenueChartsProps> = ({
  monthlyData,
  yearlyRevenue,
  dateRange,
}) => {
  const { isDarkMode } = useThemeStore();

  const data = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Chiffre d\'affaires mensuel',
        data: monthlyData.map(item => item.amount),
        fill: true,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: isDarkMode 
          ? 'rgba(99, 102, 241, 0.1)'
          : 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => formatCurrency(context.raw),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Évolution du chiffre d'affaires
      </h3>
      <div className="h-[400px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};