"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteAnimation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lottie_react_1 = __importDefault(require("lottie-react"));
const quote_json_1 = __importDefault(require("@/animations/quote.json"));
const QuoteAnimation = ({ className }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `w-64 h-64 ${className}`, children: (0, jsx_runtime_1.jsx)(lottie_react_1.default, { animationData: quote_json_1.default, loop: true, autoplay: true }) }));
};
exports.QuoteAnimation = QuoteAnimation;
