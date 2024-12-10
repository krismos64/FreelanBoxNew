import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

interface RevenueChartProps {
  data: {
    month: string;
    amount: number;
  }[];
  className?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, className }) => {
  const chartRef = useRef<ChartJS>(null);
  const { isDarkMode } = useThemeStore();

  const gradientColors = {
    light: {
      start: 'rgba(99, 102, 241, 0.5)',
      middle: 'rgba(99, 102, 241, 0.25)',
      end: 'rgba(99, 102, 241, 0.0)',
    },
    dark: {
      start: 'rgba(99, 102, 241, 0.3)',
      middle: 'rgba(99, 102, 241, 0.15)',
      end: 'rgba(99, 102, 241, 0.0)',
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
      const colors = isDarkMode ? gradientColors.dark : gradientColors.light;
      
      gradient.addColorStop(0, colors.start);
      gradient.addColorStop(0.5, colors.middle);
      gradient.addColorStop(1, colors.end);
      
      chart.data.datasets[0].backgroundColor = gradient;
      chart.update();
    }
  }, [isDarkMode]);

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Chiffre d\'affaires',
        data: data.map(item => item.amount),
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: isDarkMode ? '#1f2937' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#111827',
        bodyColor: isDarkMode ? '#ffffff' : '#111827',
        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => `${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          font: {
            family: 'SF Pro Display',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? '#374151' : '#F3F4F6',
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          font: {
            family: 'SF Pro Display',
          },
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
  };

  return (
    <div className={`relative ${className}`}>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};