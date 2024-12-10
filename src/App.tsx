import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./components/layout/Sidebar";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { QuotesPage } from "./pages/quotes/QuotesPage";
import { ClientsList } from "./pages/clients/ClientsList";
import { InvoicesPage } from "./pages/invoices/InvoicesPage";
import { ChecklistPage } from "./pages/checklist/ChecklistPage";
import { CompanySettings } from "./pages/company/CompanySettings";
import { PlanningPage } from "./pages/planning/PlanningPage";
import { StatisticsPage } from "./pages/statistics/StatisticsPage";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import { useThemeStore } from "./store/themeStore";

const App: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen">
              {" "}
              {/* Supprimé la classe dark ici */}
              <Sidebar />
              <main className="flex-1 bg-gray-50 dark:bg-gray-900 desktop-content">
                <div className="container mx-auto">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/planning" element={<PlanningPage />} />
                    <Route path="/devis" element={<QuotesPage />} />
                    <Route path="/clients" element={<ClientsList />} />
                    <Route path="/factures" element={<InvoicesPage />} />
                    <Route path="/statistiques" element={<StatisticsPage />} />
                    <Route path="/checklist" element={<ChecklistPage />} />
                    <Route path="/entreprise" element={<CompanySettings />} />
                    <Route
                      path="*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </div>
              </main>
              <ThemeToggle />
              <Toaster
                position="top-right"
                toastOptions={{
                  className: "text-sm",
                  duration: 3000,
                  style: {
                    background: isDarkMode ? "#1F2937" : "#FFFFFF",
                    color: isDarkMode ? "#FFFFFF" : "#1F2937",
                  },
                }}
              />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
