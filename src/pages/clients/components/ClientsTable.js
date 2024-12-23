"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Table_1 = require("@/components/ui/Table");
const format_1 = require("@/utils/format");
const Button_1 = require("@/components/ui/Button");
const outline_1 = require("@heroicons/react/24/outline");
const ClientsTable = ({ clients, onRowClick, onDelete, }) => {
    const [selectedClients, setSelectedClients] = (0, react_1.useState)([]);
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedClients(clients.map((client) => client.id));
        }
        else {
            setSelectedClients([]);
        }
    };
    const handleSelectClient = (id) => {
        setSelectedClients((prev) => prev.includes(id)
            ? prev.filter((clientId) => clientId !== id)
            : [...prev, id]);
    };
    const handleDelete = () => {
        if (selectedClients.length > 0) {
            onDelete(selectedClients);
            setSelectedClients([]);
        }
    };
    const ClientLogo = ({ client }) => {
        const containerClasses = "w-20 h-20 flex-shrink-0 relative overflow-hidden";
        if (client.logo) {
            return ((0, jsx_runtime_1.jsx)("div", { className: `${containerClasses} bg-gray-50 dark:bg-gray-900 rounded-lg`, children: (0, jsx_runtime_1.jsx)("img", { src: client.logo, alt: `Logo ${client.name}`, className: "w-full h-full object-contain p-2" }) }));
        }
        return ((0, jsx_runtime_1.jsx)("div", { className: `${containerClasses} rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center`, children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl font-medium text-gray-500 dark:text-gray-400", children: client.name.charAt(0).toUpperCase() }) }));
    };
    const columns = [
        {
            header: ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedClients.length === clients.length, onChange: handleSelectAll, className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700" })),
            accessor: (client) => ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedClients.includes(client.id), onChange: () => handleSelectClient(client.id), onClick: (e) => e.stopPropagation(), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700" })),
            className: "w-12",
        },
        {
            header: "",
            accessor: (client) => (0, jsx_runtime_1.jsx)(ClientLogo, { client: client }),
            className: "w-24 px-4",
        },
        {
            header: "Nom",
            accessor: "name",
            className: "font-medium",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Téléphone",
            accessor: (client) => client.phone || "-",
        },
        {
            header: "Ville",
            accessor: (client) => client.city || "-",
        },
        {
            header: "Chiffre d'affaires",
            accessor: (client) => (0, format_1.formatCurrency)(client.revenue || 0),
            className: "text-right font-medium",
        },
        {
            header: "Date de création",
            accessor: (client) => (0, format_1.formatDate)(client.createdAt),
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [selectedClients.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600 dark:text-gray-300", children: [selectedClients.length, " client", selectedClients.length > 1 ? "s" : "", " s\u00E9lectionn\u00E9", selectedClients.length > 1 ? "s" : ""] }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { variant: "danger", size: "sm", onClick: handleDelete, children: [(0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-4 w-4 mr-2" }), "Supprimer"] })] })), (0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)(Table_1.Table, { columns: columns, data: clients, onRowClick: onRowClick }) })] }));
};
exports.ClientsTable = ClientsTable;
