import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ViewColumnsIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useThemeStore } from "@/store/themeStore";

const navigationItems = [
  {
    id: "dashboard",
    name: "Tableau de bord",
    href: "/dashboard",
    icon: ViewColumnsIcon,
  },
  { id: "planning", name: "Planning", href: "/planning", icon: CalendarIcon },
  { id: "quotes", name: "Devis", href: "/devis", icon: DocumentTextIcon },
  {
    id: "invoices",
    name: "Factures",
    href: "/factures",
    icon: ClipboardDocumentListIcon,
  },
  { id: "clients", name: "Clients", href: "/clients", icon: UserGroupIcon },
  {
    id: "statistics",
    name: "Statistiques",
    href: "/statistiques",
    icon: ChartBarIcon,
  },
  {
    id: "checklist",
    name: "Checklist",
    href: "/checklist",
    icon: DocumentCheckIcon,
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const { isDarkMode } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 desktop-sidebar transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }
          border-r min-h-screen`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/dashboard"
            className="block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <h1 className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
              FreelanceBox
            </h1>
          </Link>
        </div>

        <nav className="flex-1 py-4">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`nav-item flex items-center px-4 py-2.5 mx-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                location.pathname === item.href
                  ? isDarkMode
                    ? "bg-gradient-to-r from-primary-900/50 to-primary-800/50 text-primary-300"
                    : "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700/50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 transition-transform duration-300 ${
                  location.pathname === item.href
                    ? "text-primary-500"
                    : "text-gray-500"
                }`}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/entreprise"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`nav-item flex items-center px-4 py-2.5 mx-2 text-sm font-medium rounded-lg ${
              location.pathname === "/entreprise"
                ? isDarkMode
                  ? "bg-gradient-to-r from-secondary-900/50 to-secondary-800/50 text-secondary-300"
                  : "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700"
                : isDarkMode
                ? "text-gray-300 hover:bg-gray-700/50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <BuildingOfficeIcon
              className={`mr-3 h-5 w-5 transition-transform duration-300 ${
                location.pathname === "/entreprise"
                  ? "text-secondary-500"
                  : "text-gray-500"
              }`}
            />
            Mon Entreprise
          </Link>
        </div>
      </div>
    </>
  );
};
