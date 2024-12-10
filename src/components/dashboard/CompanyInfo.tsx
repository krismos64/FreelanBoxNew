import React from 'react';
import { useThemeStore } from '@/store/themeStore';

interface CompanyInfoProps {
  onEdit: () => void;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ onEdit }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Informations de l'entreprise
        </h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300"
        >
          Modifier
        </button>
      </div>
      <div className="space-y-3">
        <InfoRow label="Nom" value="-" />
        <InfoRow label="Adresse" value="-" />
        <InfoRow label="Code postal" value="-" />
        <InfoRow label="Ville" value="-" />
        <InfoRow label="Téléphone" value="-" />
        <InfoRow label="Email" value="-" />
        <InfoRow label="Site web" value="-" />
        <InfoRow label="SIRET" value="-" />
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">{label} :</span>
      <span className="font-medium text-gray-900 dark:text-gray-200">{value}</span>
    </div>
  );
};