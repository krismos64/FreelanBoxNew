"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageHeader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button_1 = require("./Button");
const PageHeader = ({ title, buttonText, onButtonClick, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white", children: title }), buttonText && ((0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onButtonClick, variant: "gradient", className: "w-full sm:w-auto", children: buttonText }))] }));
};
exports.PageHeader = PageHeader;
