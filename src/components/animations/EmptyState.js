"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lottie_react_1 = __importDefault(require("lottie-react"));
const empty_state_json_1 = __importDefault(require("@/animations/empty-state.json"));
const EmptyState = ({ message, className }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center justify-center p-8 ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-64 h-64", children: (0, jsx_runtime_1.jsx)(lottie_react_1.default, { animationData: empty_state_json_1.default, loop: true, autoplay: true }) }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-gray-600 dark:text-gray-400 text-center", children: message })] }));
};
exports.EmptyState = EmptyState;
