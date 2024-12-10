import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ClientsTable } from './components/ClientsTable';
import { ClientSearch } from './components/ClientSearch';
import { ClientSort } from './components/ClientSort';
import { ClientDetails } from './components/ClientDetails';
import { Modal } from '@/components/ui/Modal';
import { ClientForm } from '@/components/forms/ClientForm';
import { useClientStore } from '@/store/clientStore';
import { toast } from 'react-hot-toast';
import type { Client, SortOption } from '@/types';

export const ClientsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [showDetails, setShowDetails] = useState(false);
  
  const { clients, addClient, updateClient, deleteClients } = useClientStore();

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(client => 
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.city?.toLowerCase().includes(query)
      );
    }
    
    const [field, direction] = sortOption.split('-');
    result.sort((a, b) => {
      let comparison = 0;
      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return direction === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [clients, searchQuery, sortOption]);

  const handleCreateClient = (data: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    addClient(newClient);
    setIsModalOpen(false);
    toast.success('Client créé avec succès');
  };

  const handleEditClient = (data: Omit<Client, 'id' | 'createdAt'>) => {
    if (selectedClient) {
      updateClient(selectedClient.id, data);
      setIsModalOpen(false);
      setSelectedClient(null);
      toast.success('Client mis à jour avec succès');
    }
  };

  const handleDeleteClients = (ids: string[]) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${ids.length} client${ids.length > 1 ? 's' : ''} ?`)) {
      deleteClients(ids);
      toast.success(`${ids.length} client${ids.length > 1 ? 's' : ''} supprimé${ids.length > 1 ? 's' : ''}`);
    }
  };

  const handleRowClick = (client: Client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Clients"
        buttonText="Nouveau client"
        onButtonClick={() => {
          setSelectedClient(null);
          setIsModalOpen(true);
        }}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <ClientSearch value={searchQuery} onChange={setSearchQuery} />
        <ClientSort value={sortOption} onChange={setSortOption} />
      </div>

      <ClientsTable
        clients={filteredAndSortedClients}
        onRowClick={handleRowClick}
        onDelete={handleDeleteClients}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        title={selectedClient ? 'Modifier le client' : 'Nouveau client'}
      >
        <ClientForm
          onSubmit={selectedClient ? handleEditClient : handleCreateClient}
          initialData={selectedClient || undefined}
        />
      </Modal>

      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedClient(null);
        }}
        title="Détails du client"
      >
        {selectedClient && (
          <ClientDetails
            client={selectedClient}
            onEdit={() => {
              setShowDetails(false);
              setIsModalOpen(true);
            }}
          />
        )}
      </Modal>
    </div>
  );
};