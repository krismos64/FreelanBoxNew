"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessAnimation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lottie_react_1 = __importDefault(require("lottie-react"));
const success_json_1 = __importDefault(require("@/animations/success.json"));
const SuccessAnimation = ({ className, onComplete }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `w-24 h-24 ${className}`, children: (0, jsx_runtime_1.jsx)(lottie_react_1.default, { animationData: success_json_1.default, loop: false, autoplay: true, onComplete: onComplete }) }));
};
exports.SuccessAnimation = SuccessAnimation;
