"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PageHeader_1 = require("@/components/ui/PageHeader");
const ClientsTable_1 = require("./components/ClientsTable");
const ClientSearch_1 = require("./components/ClientSearch");
const ClientSort_1 = require("./components/ClientSort");
const ClientDetails_1 = require("./components/ClientDetails");
const Modal_1 = require("@/components/ui/Modal");
const ClientForm_1 = require("@/components/forms/ClientForm");
const clientStore_1 = require("@/store/clientStore");
const react_hot_toast_1 = require("react-hot-toast");
const ClientsList = () => {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [selectedClient, setSelectedClient] = (0, react_1.useState)(null);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)("");
    const [sortOption, setSortOption] = (0, react_1.useState)("name-asc");
    const [showDetails, setShowDetails] = (0, react_1.useState)(false);
    const { clients, addClient, updateClient, deleteClients } = (0, clientStore_1.useClientStore)();
    const filteredAndSortedClients = (0, react_1.useMemo)(() => {
        let result = [...clients];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((client) => client.name.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query) ||
                client.city?.toLowerCase().includes(query));
        }
        const [field, direction] = sortOption.split("-");
        result.sort((a, b) => {
            let comparison = 0;
            switch (field) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "date":
                    comparison =
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                default:
                    comparison = 0;
            }
            return direction === "asc" ? comparison : -comparison;
        });
        return result;
    }, [clients, searchQuery, sortOption]);
    const handleCreateClient = (data) => {
        const newClient = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        addClient(newClient);
        setIsModalOpen(false);
        react_hot_toast_1.toast.success("Client créé avec succès");
    };
    const handleEditClient = (data) => {
        if (selectedClient) {
            updateClient(selectedClient.id, data);
            setIsModalOpen(false);
            setSelectedClient(null);
            react_hot_toast_1.toast.success("Client mis à jour avec succès");
        }
    };
    const handleDeleteClients = (ids) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${ids.length} client${ids.length > 1 ? "s" : ""} ?`)) {
            deleteClients(ids);
            react_hot_toast_1.toast.success(`${ids.length} client${ids.length > 1 ? "s" : ""} supprimé${ids.length > 1 ? "s" : ""}`);
        }
    };
    const handleRowClick = (client) => {
        setSelectedClient(client);
        setShowDetails(true);
    };
    // Composant carte pour l'affichage mobile
    const MobileClientCard = ({ client }) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handleRowClick(client), className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-between items-start", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: client.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: client.email })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col text-sm text-gray-500 dark:text-gray-400 space-y-1", children: [client.phone && (0, jsx_runtime_1.jsx)("div", { children: client.phone }), client.city && (0, jsx_runtime_1.jsx)("div", { children: client.city })] })] }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 p-4 sm:p-6", children: [(0, jsx_runtime_1.jsx)(PageHeader_1.PageHeader, { title: "Clients", buttonText: "Nouveau client", onButtonClick: () => {
                    setSelectedClient(null);
                    setIsModalOpen(true);
                } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4 sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 -mx-4 sm:-mx-6 p-4 sm:p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full sm:w-2/3", children: (0, jsx_runtime_1.jsx)(ClientSearch_1.ClientSearch, { value: searchQuery, onChange: setSearchQuery }) }), (0, jsx_runtime_1.jsx)("div", { className: "w-full sm:w-1/3", children: (0, jsx_runtime_1.jsx)(ClientSort_1.ClientSort, { value: sortOption, onChange: setSortOption }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "hidden sm:block", children: (0, jsx_runtime_1.jsx)(ClientsTable_1.ClientsTable, { clients: filteredAndSortedClients, onRowClick: handleRowClick, onDelete: handleDeleteClients }) }), (0, jsx_runtime_1.jsx)("div", { className: "sm:hidden space-y-4", children: filteredAndSortedClients.map((client) => ((0, jsx_runtime_1.jsx)(MobileClientCard, { client: client }, client.id))) }), (0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedClient(null);
                }, title: selectedClient ? "Modifier le client" : "Nouveau client", children: (0, jsx_runtime_1.jsx)(ClientForm_1.ClientForm, { onSubmit: selectedClient ? handleEditClient : handleCreateClient, initialData: selectedClient || undefined }) }), (0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: showDetails, onClose: () => {
                    setShowDetails(false);
                    setSelectedClient(null);
                }, title: "D\u00E9tails du client", children: selectedClient && ((0, jsx_runtime_1.jsx)(ClientDetails_1.ClientDetails, { client: selectedClient, onEdit: () => {
                        setShowDetails(false);
                        setIsModalOpen(true);
                    } })) })] }));
};
exports.ClientsList = ClientsList;
