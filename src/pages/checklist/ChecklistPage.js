"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const PageHeader_1 = require("@/components/ui/PageHeader");
const input_1 = require("@/components/ui/input");
const Button_1 = require("@/components/ui/Button");
const ChecklistItem_1 = require("@/components/checklist/ChecklistItem");
const checklistStore_1 = require("@/store/checklistStore");
const outline_1 = require("@heroicons/react/24/outline");
const lucide_react_1 = require("lucide-react");
const react_hot_toast_1 = require("react-hot-toast");
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
// Ajout d'un composant wrapper pour strict mode
const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = (0, react_1.useState)(false);
    react_1.default.useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.Droppable, { ...props, children: children });
};
const ChecklistPage = () => {
    const [newItemTitle, setNewItemTitle] = (0, react_1.useState)("");
    const { items, addItem, updateItem, deleteItem, toggleItem, reorderItems } = (0, checklistStore_1.useChecklistStore)();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newItemTitle.trim()) {
            addItem(newItemTitle.trim());
            setNewItemTitle("");
            react_hot_toast_1.toast.success("Élément ajouté à la checklist");
        }
    };
    const handleUpdate = (id, title) => {
        updateItem(id, { title });
        react_hot_toast_1.toast.success("Élément mis à jour");
    };
    const handleDelete = (id) => {
        deleteItem(id);
        react_hot_toast_1.toast.success("Élément supprimé");
    };
    const handleToggle = (id) => {
        toggleItem(id);
    };
    const handleDragEnd = (result) => {
        if (!result.destination)
            return;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        if (sourceIndex === destinationIndex)
            return;
        const itemsCopy = Array.from(items);
        const [removed] = itemsCopy.splice(sourceIndex, 1);
        itemsCopy.splice(destinationIndex, 0, removed);
        reorderItems(itemsCopy);
        react_hot_toast_1.toast.success("Liste réorganisée");
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(PageHeader_1.PageHeader, { title: "Checklist" }), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-3xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "mb-6 flex space-x-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { value: newItemTitle, onChange: (e) => setNewItemTitle(e.target.value), placeholder: "Ajouter un nouvel \u00E9l\u00E9ment...", className: "flex-1" }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { type: "submit", disabled: !newItemTitle.trim(), children: [(0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-5 w-5 mr-2" }), "Ajouter"] })] }), (0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleDragEnd, children: (0, jsx_runtime_1.jsx)(StrictModeDroppable, { droppableId: "checklist", children: (provided) => ((0, jsx_runtime_1.jsxs)("div", { ref: provided.innerRef, ...provided.droppableProps, className: "bg-white dark:bg-gray-800 rounded-lg shadow", children: [items.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "p-4 text-center text-gray-500 dark:text-gray-400", children: "Aucun \u00E9l\u00E9ment dans la checklist" })) : (items.map((item, index) => ((0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.Draggable, { draggableId: item.id, index: index, children: (dragProvided, snapshot) => ((0, jsx_runtime_1.jsx)("div", { ref: dragProvided.innerRef, ...dragProvided.draggableProps, className: `
                            border-b border-gray-200 dark:border-gray-700 last:border-0
                            transition-all duration-200 ease-in-out
                            ${snapshot.isDragging
                                                ? "shadow-lg bg-gray-50 dark:bg-gray-700 scale-[1.02]"
                                                : ""}
                          `, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center p-4 space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { ...dragProvided.dragHandleProps, className: `
                                cursor-grab active:cursor-grabbing
                                ${snapshot.isDragging
                                                            ? "text-blue-500"
                                                            : "text-gray-400"}
                              `, children: (0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)(ChecklistItem_1.ChecklistItem, { item: item, onToggle: () => handleToggle(item.id), onUpdate: (title) => handleUpdate(item.id, title), onDelete: () => handleDelete(item.id) }) })] }) })) }, item.id)))), provided.placeholder] })) }) })] })] }));
};
exports.ChecklistPage = ChecklistPage;
