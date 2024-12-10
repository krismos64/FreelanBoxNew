import React from 'react';
import { WelcomeAnimation } from '@/components/animations/WelcomeAnimation';
import { useCompanyStore } from '@/store/companyStore';
import { useCalendarStore } from '@/store/calendarStore';
import { useStatisticsStore } from '@/store/statisticsStore';
import { getFormattedDate } from '@/utils/date-utils';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { formatCurrency } from '@/utils/format';
import { isToday } from 'date-fns';

export const Dashboard = () => {
  const { company } = useCompanyStore();
  const { events } = useCalendarStore();
  const { monthlyRevenue, yearlyRevenue, totalRevenue, revenueHistory } = useStatisticsStore();
  const todayDate = getFormattedDate();

  // Filter today's events
  const todayEvents = events.filter(event => isToday(event.start));

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Company Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-6">
          {company.logo && (
            <img
              src={company.logo}
              alt="Logo de l'entreprise"
              className="w-16 h-16 object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {company.name || 'Votre Entreprise'}
            </h1>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-8 text-white">
          <div className="space-y-4">
            <p className="text-xl font-medium">
              Bonjour, nous sommes le {todayDate}.
            </p>
            <p className="text-lg opacity-90">
              Une bonne organisation de votre entreprise sera la clé de votre succès !
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Revenue Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chiffre d'affaires mensuel
            </h2>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(monthlyRevenue)}
            </p>
          </div>

          {/* Yearly Revenue Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chiffre d'affaires annuel
            </h2>
            <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
              {formatCurrency(yearlyRevenue)}
            </p>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chiffre d'affaires total
            </h2>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Today's Events Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Événements du jour
          </h2>
          <div className="space-y-3">
            {todayEvents.length > 0 ? (
              todayEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.start).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Aucun événement aujourd'hui
              </p>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Évolution du chiffre d'affaires
          </h2>
          <div className="h-[400px]">
            <RevenueChart data={revenueHistory} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};