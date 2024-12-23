"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingSpinner = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lottie_react_1 = __importDefault(require("lottie-react"));
const loading_spinner_json_1 = __importDefault(require("@/animations/loading-spinner.json"));
const LoadingSpinner = ({ className }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `w-24 h-24 ${className}`, children: (0, jsx_runtime_1.jsx)(lottie_react_1.default, { animationData: loading_spinner_json_1.default, loop: true, autoplay: true }) }));
};
exports.LoadingSpinner = LoadingSpinner;