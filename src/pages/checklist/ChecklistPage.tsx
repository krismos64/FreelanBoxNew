import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChecklistItem } from '@/components/checklist/ChecklistItem';
import { useChecklistStore } from '@/store/checklistStore';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const ChecklistPage = () => {
  const [newItemTitle, setNewItemTitle] = useState('');
  const { items, addItem, updateItem, deleteItem, toggleItem } = useChecklistStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemTitle.trim()) {
      addItem(newItemTitle.trim());
      setNewItemTitle('');
      toast.success('Élément ajouté à la checklist');
    }
  };

  const handleUpdate = (id: string, title: string) => {
    updateItem(id, { title });
    toast.success('Élément mis à jour');
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    toast.success('Élément supprimé');
  };

  const handleToggle = (id: string) => {
    toggleItem(id);
  };

  return (
    <div className="p-6">
      <PageHeader title="Checklist" />
      
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-6 flex space-x-2">
          <Input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Ajouter un nouvel élément..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newItemTitle.trim()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter
          </Button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
          {items.length === 0 ? (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">
              Aucun élément dans la checklist
            </p>
          ) : (
            items.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                onToggle={() => handleToggle(item.id)}
                onUpdate={(title) => handleUpdate(item.id, title)}
                onDelete={() => handleDelete(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};