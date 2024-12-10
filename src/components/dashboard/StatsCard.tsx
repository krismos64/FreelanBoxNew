import React from 'react';
import { useThemeStore } from '@/store/themeStore';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'indigo';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  color = 'blue'
}) => {
  const { isDarkMode } = useThemeStore();

  const colorStyles = {
    blue: {
      icon: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    green: {
      icon: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    purple: {
      icon: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    indigo: {
      icon: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">{title}</h3>
          <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            {subtitle}
          </p>
        </div>
        <div className={`${colorStyles[color].bg} p-3 rounded-full`}>
          <div className={colorStyles[color].icon}>{icon}</div>
        </div>
      </div>
    </div>
  );
};