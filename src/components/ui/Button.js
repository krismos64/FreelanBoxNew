"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
const Button = ({ children, className, variant = 'primary', size = 'md', isLoading = false, disabled, ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-primary-500/50',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-lg hover:shadow-secondary-500/50',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-red-500/50',
        gradient: 'button-gradient text-white focus:ring-primary-500 shadow-lg',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    return ((0, jsx_runtime_1.jsxs)("button", { className: (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(baseStyles, variants[variant], sizes[size], isLoading && 'opacity-70 cursor-not-allowed transform-none', disabled && 'opacity-50 cursor-not-allowed transform-none', className)), disabled: disabled || isLoading, ...props, children: [isLoading ? ((0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-current", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] })) : null, children] }));
};
exports.Button = Button;
