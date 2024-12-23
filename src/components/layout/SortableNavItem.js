"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortableNavItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const sortable_1 = require("@dnd-kit/sortable");
const utilities_1 = require("@dnd-kit/utilities");
const themeStore_1 = require("@/store/themeStore");
const outline_1 = require("@heroicons/react/24/outline");
const SortableNavItem = ({ item, isActive }) => {
    const { isDarkMode } = (0, themeStore_1.useThemeStore)();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = (0, sortable_1.useSortable)({ id: item.id });
    const style = {
        transform: utilities_1.CSS.Transform.toString(transform),
        transition,
    };
    return ((0, jsx_runtime_1.jsxs)("div", { ref: setNodeRef, style: style, className: `group flex items-center ${isDragging ? 'opacity-50' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { ...attributes, ...listeners, className: "cursor-grab opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded", children: (0, jsx_runtime_1.jsx)(outline_1.GripVerticalIcon, { className: "h-4 w-4 text-gray-400" }) }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: item.href, className: `flex-1 flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive
                    ? isDarkMode
                        ? 'bg-blue-900 text-blue-200'
                        : 'bg-blue-50 text-blue-700'
                    : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-50'}`, children: [(0, jsx_runtime_1.jsx)(item.icon, { className: "mr-3 h-5 w-5" }), item.name] })] }));
};
exports.SortableNavItem = SortableNavItem;
