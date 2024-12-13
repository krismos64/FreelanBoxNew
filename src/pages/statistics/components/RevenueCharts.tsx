import React, { useRef, useEffect } from "react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCurrency } from "@/utils/format";
import { useThemeStore } from "@/store/themeStore";

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
  const chartRef = useRef<ChartJS<"line">>(null);
  const { isDarkMode } = useThemeStore();

  const gradientColors = {
    light: {
      start: "rgba(99, 102, 241, 0.5)",
      middle: "rgba(99, 102, 241, 0.25)",
      end: "rgba(99, 102, 241, 0.0)",
    },
    dark: {
      start: "rgba(99, 102, 241, 0.3)",
      middle: "rgba(99, 102, 241, 0.15)",
      end: "rgba(99, 102, 241, 0.0)",
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

  // Fonction pour convertir le mois en format Date
  const parseMonth = (monthStr: string) => {
    const [monthName, year] = monthStr.split(" ");
    const monthMap: { [key: string]: number } = {
      janvier: 0,
      février: 1,
      mars: 2,
      avril: 3,
      mai: 4,
      juin: 5,
      juillet: 6,
      août: 7,
      septembre: 8,
      octobre: 9,
      novembre: 10,
      décembre: 11,
    };
    return new Date(parseInt(year), monthMap[monthName.toLowerCase()]);
  };

  // Trier les données chronologiquement
  const sortedData = [...monthlyData].sort((a, b) => {
    return parseMonth(a.month).getTime() - parseMonth(b.month).getTime();
  });

  const data = {
    labels: sortedData.map((item) => item.month),
    datasets: [
      {
        label: "Chiffre d'affaires mensuel",
        data: sortedData.map((item) => item.amount),
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 3,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: isDarkMode ? "#1f2937" : "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: "easeInQuad" as const,
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#374151" : "#ffffff",
        titleColor: isDarkMode ? "#ffffff" : "#111827",
        bodyColor: isDarkMode ? "#ffffff" : "#111827",
        borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
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
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
          font: {
            family: "SF Pro Display",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? "#374151" : "#F3F4F6",
        },
        ticks: {
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
          font: {
            family: "SF Pro Display",
          },
          callback: function (value: number | string): string {
            return formatCurrency(value as number);
          },
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
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};
