import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '../Button';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 !p-2 lg:!p-3 rounded-full shadow-lg"
      aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5 lg:h-6 lg:w-6" />
      ) : (
        <MoonIcon className="h-5 w-5 lg:h-6 lg:w-6" />
      )}
    </Button>
  );
};