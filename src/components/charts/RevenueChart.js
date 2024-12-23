"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueChart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const chart_js_1 = require("chart.js");
const react_chartjs_2_1 = require("react-chartjs-2");
const format_1 = require("@/utils/format");
const themeStore_1 = require("@/store/themeStore");
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.Filler);
const RevenueChart = ({ data, className }) => {
    const chartRef = (0, react_1.useRef)(null);
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
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
    (0, react_1.useEffect)(() => {
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
    const parseMonth = (monthStr) => {
        const [monthName, year] = monthStr.split(" ");
        const monthMap = {
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
    const sortedData = [...data].sort((a, b) => {
        return parseMonth(a.month).getTime() - parseMonth(b.month).getTime();
    });
    const chartData = {
        labels: sortedData.map((item) => item.month),
        datasets: [
            {
                label: "Chiffre d'affaires",
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
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: "easeInQuad",
        },
        interaction: {
            mode: "nearest",
            axis: "x",
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
                    label: (context) => `${(0, format_1.formatCurrency)(context.raw)}`,
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
                    callback: function (value) {
                        return (0, format_1.formatCurrency)(value);
                    },
                },
            },
        },
    };
    return ((0, jsx_runtime_1.jsx)(react_chartjs_2_1.Line, { data: chartData, options: chartOptions, ref: chartRef, className: className }));
};
exports.RevenueChart = RevenueChart;
