"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSelect = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const clientStore_1 = require("@/store/clientStore");
exports.ClientSelect = react_1.default.forwardRef(({ label, error, className, ...props }, ref) => {
    const { clients } = (0, clientStore_1.useClientStore)();
    return ((0, jsx_runtime_1.jsxs)("div", { children: [label && ((0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: label })), (0, jsx_runtime_1.jsxs)("select", { ref: ref, className: `block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm 
            focus:border-primary-500 focus:ring-primary-500 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}`, ...props, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "S\u00E9lectionner un client" }), clients.map((client) => ((0, jsx_runtime_1.jsx)("option", { value: client.id, children: client.company ? `${client.company} (${client.name})` : client.name }, client.id)))] }), error && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error }))] }));
});
exports.ClientSelect.displayName = 'ClientSelect';
