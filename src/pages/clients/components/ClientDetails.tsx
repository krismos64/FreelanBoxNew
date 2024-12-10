import React from 'react';
import { Button } from '@/components/ui/Button';
import { formatDate, formatCurrency } from '@/utils/format';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Client } from '@/types';
import { DocumentTextIcon, DocumentIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface ClientDetailsProps {
  client: Client;
  onEdit: () => void;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ client, onEdit }) => {
  return (
    <div className="space-y-6">
      {/* Client Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {client.logo ? (
              <img 
                src={client.logo} 
                alt={`Logo ${client.name}`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-500 dark:text-gray-400">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {client.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Client depuis le {format(new Date(client.createdAt), 'PP', { locale: fr })}
              </p>
            </div>
          </div>
          <Button onClick={onEdit} variant="secondary" size="sm">
            Modifier
          </Button>
        </div>

        {/* Revenue Card */}
        <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white">
          <div className="flex items-center space-x-3">
            <BanknotesIcon className="w-8 h-8" />
            <div>
              <p className="text-sm font-medium text-white/90">Chiffre d'affaires total</p>
              <p className="text-2xl font-bold">{formatCurrency(client.revenue || 0)}</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <InfoField label="Email" value={client.email} />
          <InfoField label="Téléphone" value={client.phone} />
          <InfoField label="Adresse" value={client.address} />
          <InfoField label="Code postal" value={client.postalCode} />
          <InfoField label="Ville" value={client.city} />
          <InfoField label="SIRET" value={client.siret} />
        </div>

        {/* Documents */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Documents
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <DocumentCard
              icon={DocumentTextIcon}
              title="Devis"
              count={client.quotes?.length || 0}
            />
            <DocumentCard
              icon={DocumentIcon}
              title="Factures"
              count={client.invoices?.length || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div>
    <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{value || '-'}</dd>
  </div>
);

const DocumentCard: React.FC<{ icon: React.ElementType; title: string; count: number }> = ({ 
  icon: Icon, 
  title, 
  count 
}) => (
  <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
    <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{count} document{count > 1 ? 's' : ''}</p>
    </div>
  </div>
);