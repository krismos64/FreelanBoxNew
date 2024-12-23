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
exports.Input = react_1.default.forwardRef(({ className, label, error, multiline = false, rows = 3, ...props }, ref) => {
    const inputClasses = (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)("block w-full rounded-lg shadow-sm sm:text-sm transition-colors duration-200", "border-gray-300 dark:border-gray-600", "bg-white dark:bg-gray-700", "text-gray-900 dark:text-white", "focus:ring-2 focus:ring-primary-500 focus:border-primary-500", "placeholder-gray-400 dark:placeholder-gray-500", error && "border-red-300 focus:ring-red-500 focus:border-red-500", className));
    const labelClasses = (0, clsx_1.clsx)("block text-sm font-medium mb-1", "text-gray-700 dark:text-white");
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full", children: [label && (0, jsx_runtime_1.jsx)("label", { className: labelClasses, children: label }), multiline ? ((0, jsx_runtime_1.jsx)("textarea", { ref: ref, rows: rows, className: inputClasses, ...props })) : ((0, jsx_runtime_1.jsx)("input", { ref: ref, className: inputClasses, ...props })), error && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error }))] }));
});
exports.Input.displayName = "Input";
