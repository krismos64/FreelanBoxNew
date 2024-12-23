"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeAnimation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lottie_react_1 = __importDefault(require("lottie-react"));
const welcome_json_1 = __importDefault(require("@/animations/welcome.json"));
const WelcomeAnimation = ({ className }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `animate-fade-in ${className}`, children: (0, jsx_runtime_1.jsx)(lottie_react_1.default, { animationData: welcome_json_1.default, loop: true, autoplay: true }) }));
};
exports.WelcomeAnimation = WelcomeAnimation;
