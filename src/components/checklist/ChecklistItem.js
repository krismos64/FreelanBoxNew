"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = require("@/components/ui/Button");
const input_1 = require("@/components/ui/input");
const outline_1 = require("@heroicons/react/24/outline");
const ChecklistItem = ({ item, onToggle, onUpdate, onDelete, }) => {
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editedTitle, setEditedTitle] = (0, react_1.useState)(item.title);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editedTitle.trim()) {
            onUpdate(editedTitle.trim());
            setIsEditing(false);
        }
    };
    const handleCancel = () => {
        setEditedTitle(item.title);
        setIsEditing(false);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg group", children: isEditing ? ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "flex-1 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { value: editedTitle, onChange: (e) => setEditedTitle(e.target.value), className: "flex-1", autoFocus: true }), (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", size: "sm", variant: "primary", children: (0, jsx_runtime_1.jsx)(outline_1.CheckIcon, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "button", size: "sm", variant: "secondary", onClick: handleCancel, children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-4 w-4" }) })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 flex-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onToggle, className: `w-5 h-5 rounded border ${item.completed
                                ? "bg-primary-500 border-primary-600 text-white"
                                : "border-gray-300 dark:border-gray-600"} flex items-center justify-center`, children: item.completed && (0, jsx_runtime_1.jsx)(outline_1.CheckIcon, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("span", { className: `flex-1 ${item.completed
                                ? "text-gray-500 dark:text-gray-400 line-through"
                                : "text-gray-900 dark:text-white"}`, children: item.title })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", size: "sm", onClick: () => setIsEditing(true), children: (0, jsx_runtime_1.jsx)(outline_1.PencilIcon, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "danger", size: "sm", onClick: onDelete, children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-4 w-4" }) })] })] })) }));
};
exports.ChecklistItem = ChecklistItem;
