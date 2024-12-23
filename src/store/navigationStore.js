"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNavigationStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const outline_1 = require("@heroicons/react/24/outline");
const defaultItems = [
    { id: 'dashboard', name: 'Tableau de bord', href: '/dashboard', icon: outline_1.ViewColumnsIcon },
    { id: 'planning', name: 'Planning', href: '/planning', icon: outline_1.CalendarIcon },
    { id: 'quotes', name: 'Devis', href: '/devis', icon: outline_1.DocumentTextIcon },
    { id: 'invoices', name: 'Factures', href: '/factures', icon: outline_1.ClipboardDocumentListIcon },
    { id: 'clients', name: 'Clients', href: '/clients', icon: outline_1.UserGroupIcon },
    { id: 'statistics', name: 'Statistiques', href: '/statistiques', icon: outline_1.ChartBarIcon },
    { id: 'checklist', name: 'Checklist', href: '/checklist', icon: outline_1.DocumentCheckIcon },
];
exports.useNavigationStore = (0, zustand_1.create)()((0, middleware_1.persist)(() => ({
    items: defaultItems,
}), {
    name: 'navigation-storage',
}));
