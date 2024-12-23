"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const Modal = ({ isOpen, onClose, title, children }) => {
    return ((0, jsx_runtime_1.jsx)(react_2.Transition, { show: isOpen, as: react_1.default.Fragment, children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, { as: "div", className: "relative z-10", onClose: onClose, children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.default.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75" }) }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-10 overflow-y-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0", children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.default.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95", enterTo: "opacity-100 translate-y-0 sm:scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 translate-y-0 sm:scale-100", leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95", children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "relative transform rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute right-0 top-0 pr-4 pt-4", children: (0, jsx_runtime_1.jsx)("button", { type: "button", className: "rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300", onClick: onClose, children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "sm:flex sm:items-start", children: (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 text-center sm:mt-0 sm:text-left w-full", children: [(0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { as: "h3", className: "text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4", children: title }), children] }) })] }) }) }) })] }) }));
};
exports.Modal = Modal;
