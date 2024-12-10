import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ViewColumnsIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType } from 'react';

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: ComponentType;
}

interface NavigationStore {
  items: NavigationItem[];
}

const defaultItems: NavigationItem[] = [
  { id: 'dashboard', name: 'Tableau de bord', href: '/dashboard', icon: ViewColumnsIcon },
  { id: 'planning', name: 'Planning', href: '/planning', icon: CalendarIcon },
  { id: 'quotes', name: 'Devis', href: '/devis', icon: DocumentTextIcon },
  { id: 'invoices', name: 'Factures', href: '/factures', icon: ClipboardDocumentListIcon },
  { id: 'clients', name: 'Clients', href: '/clients', icon: UserGroupIcon },
  { id: 'statistics', name: 'Statistiques', href: '/statistiques', icon: ChartBarIcon },
  { id: 'checklist', name: 'Checklist', href: '/checklist', icon: DocumentCheckIcon },
];

export const useNavigationStore = create<NavigationStore>()(
  persist(
    () => ({
      items: defaultItems,
    }),
    {
      name: 'navigation-storage',
    }
  )
);