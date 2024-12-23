"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const outline_1 = require("@heroicons/react/24/outline");
const themeStore_1 = require("@/store/themeStore");
const navigationItems = [
    {
        id: "dashboard",
        name: "Tableau de bord",
        href: "/dashboard",
        icon: outline_1.ViewColumnsIcon,
    },
    { id: "planning", name: "Planning", href: "/planning", icon: outline_1.CalendarIcon },
    { id: "quotes", name: "Devis", href: "/devis", icon: outline_1.DocumentTextIcon },
    {
        id: "invoices",
        name: "Factures",
        href: "/factures",
        icon: outline_1.ClipboardDocumentListIcon,
    },
    { id: "clients", name: "Clients", href: "/clients", icon: outline_1.UserGroupIcon },
    {
        id: "statistics",
        name: "Statistiques",
        href: "/statistiques",
        icon: outline_1.ChartBarIcon,
    },
    {
        id: "checklist",
        name: "Checklist",
        href: "/checklist",
        icon: outline_1.DocumentCheckIcon,
    },
];
const Sidebar = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg", onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), children: isMobileMenuOpen ? ((0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6 text-gray-600 dark:text-gray-300" })) : ((0, jsx_runtime_1.jsx)(outline_1.Bars3Icon, { className: "h-6 w-6 text-gray-600 dark:text-gray-300" })) }), isMobileMenuOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden", onClick: () => setIsMobileMenuOpen(false) })), (0, jsx_runtime_1.jsxs)("div", { className: `fixed lg:static inset-y-0 left-0 z-40 desktop-sidebar transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"}
          ${isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"}
          border-r min-h-screen`, children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/dashboard", className: "block", onClick: () => setIsMobileMenuOpen(false), children: (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold gradient-text hover:opacity-80 transition-opacity", children: "FreelanceBox" }) }) }), (0, jsx_runtime_1.jsx)("nav", { className: "flex-1 py-4", children: navigationItems.map((item) => ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: item.href, onClick: () => setIsMobileMenuOpen(false), className: `nav-item flex items-center px-4 py-2.5 mx-2 text-sm font-medium rounded-lg transition-colors duration-200 ${location.pathname === item.href
                                ? isDarkMode
                                    ? "bg-gradient-to-r from-primary-900/50 to-primary-800/50 text-primary-300"
                                    : "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700"
                                : isDarkMode
                                    ? "text-gray-300 hover:bg-gray-700/50"
                                    : "text-gray-700 hover:bg-gray-50"}`, children: [(0, jsx_runtime_1.jsx)(item.icon, { className: `mr-3 h-5 w-5 transition-transform duration-300 ${location.pathname === item.href
                                        ? "text-primary-500"
                                        : "text-gray-500"}` }), item.name] }, item.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/entreprise", onClick: () => setIsMobileMenuOpen(false), className: `nav-item flex items-center px-4 py-2.5 mx-2 text-sm font-medium rounded-lg ${location.pathname === "/entreprise"
                                ? isDarkMode
                                    ? "bg-gradient-to-r from-secondary-900/50 to-secondary-800/50 text-secondary-300"
                                    : "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700"
                                : isDarkMode
                                    ? "text-gray-300 hover:bg-gray-700/50"
                                    : "text-gray-700 hover:bg-gray-50"}`, children: [(0, jsx_runtime_1.jsx)(outline_1.BuildingOfficeIcon, { className: `mr-3 h-5 w-5 transition-transform duration-300 ${location.pathname === "/entreprise"
                                        ? "text-secondary-500"
                                        : "text-gray-500"}` }), "Mon Entreprise"] }) })] })] }));
};
exports.Sidebar = Sidebar;
