"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_hot_toast_1 = require("react-hot-toast");
const Sidebar_1 = require("./components/layout/Sidebar");
const LandingPage_1 = require("./pages/LandingPage");
const LoginPage_1 = require("./components/auth/LoginPage");
const RegisterPage_1 = require("./components/auth/RegisterPage");
const Dashboard_1 = require("./pages/Dashboard");
const QuotesPage_1 = require("./pages/quotes/QuotesPage");
const ClientsList_1 = require("./pages/clients/ClientsList");
const InvoicesPage_1 = require("./pages/invoices/InvoicesPage");
const ChecklistPage_1 = require("./pages/checklist/ChecklistPage");
const CompanySettings_1 = require("./pages/company/CompanySettings");
const PlanningPage_1 = require("./pages/planning/PlanningPage");
const StatisticsPage_1 = require("./pages/statistics/StatisticsPage");
const ThemeToggle_1 = require("./components/ui/ThemeToggle");
const themeStore_1 = require("./store/themeStore");
const App = () => {
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
    (0, react_1.useEffect)(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(LandingPage_1.LandingPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(LoginPage_1.LoginPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/register", element: (0, jsx_runtime_1.jsx)(RegisterPage_1.RegisterPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/*", element: (0, jsx_runtime_1.jsxs)("div", { className: "flex min-h-screen", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.Sidebar, {}), (0, jsx_runtime_1.jsx)("main", { className: "flex-1 bg-gray-50 dark:bg-gray-900 desktop-content", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/dashboard", element: (0, jsx_runtime_1.jsx)(Dashboard_1.Dashboard, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/planning", element: (0, jsx_runtime_1.jsx)(PlanningPage_1.PlanningPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/devis", element: (0, jsx_runtime_1.jsx)(QuotesPage_1.QuotesPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/clients", element: (0, jsx_runtime_1.jsx)(ClientsList_1.ClientsList, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/factures", element: (0, jsx_runtime_1.jsx)(InvoicesPage_1.InvoicesPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/statistiques", element: (0, jsx_runtime_1.jsx)(StatisticsPage_1.StatisticsPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/checklist", element: (0, jsx_runtime_1.jsx)(ChecklistPage_1.ChecklistPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/entreprise", element: (0, jsx_runtime_1.jsx)(CompanySettings_1.CompanySettings, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/dashboard", replace: true }) })] }) }) }), (0, jsx_runtime_1.jsx)(ThemeToggle_1.ThemeToggle, {}), (0, jsx_runtime_1.jsx)(react_hot_toast_1.Toaster, { position: "top-right", toastOptions: {
                                    className: "text-sm",
                                    duration: 3000,
                                    style: {
                                        background: isDarkMode ? "#1F2937" : "#FFFFFF",
                                        color: isDarkMode ? "#FFFFFF" : "#1F2937",
                                    },
                                } })] }) })] }) }));
};
exports.default = App;
