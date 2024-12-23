"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
exports.Input = react_1.default.forwardRef(({ className, label, error, ...props }, ref) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full", children: [label && ((0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label })), (0, jsx_runtime_1.jsx)("input", { ref: ref, className: (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)("block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm", error && "border-red-300 focus:border-red-500 focus:ring-red-500", className)), ...props }), error && (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-red-600", children: error })] }));
});
