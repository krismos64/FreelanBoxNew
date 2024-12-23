"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const framer_motion_1 = require("framer-motion");
const react_intersection_observer_1 = require("react-intersection-observer");
const lottie_react_1 = __importDefault(require("lottie-react"));
const Modal_1 = require("@/components/ui/Modal");
const welcome_json_1 = __importDefault(require("@/animations/welcome.json"));
const play_button_json_1 = __importDefault(require("@/animations/play-button.json"));
const Button_1 = require("@/components/ui/Button");
const outline_1 = require("@heroicons/react/24/outline");
const LandingPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [showVideo, setShowVideo] = (0, react_1.useState)(false);
    const [ref, inView] = (0, react_intersection_observer_1.useInView)({
        triggerOnce: true,
        threshold: 0.1,
    });
    const features = [
        {
            icon: outline_1.DocumentTextIcon,
            title: "Devis & Factures",
            description: "Créez et gérez vos documents professionnels en quelques clics",
        },
        {
            icon: outline_1.UserGroupIcon,
            title: "Gestion Clients",
            description: "Centralisez vos contacts et suivez vos relations clients",
        },
        {
            icon: outline_1.CalendarIcon,
            title: "Planning Intégré",
            description: "Organisez votre temps et vos rendez-vous efficacement",
        },
        {
            icon: outline_1.ChartBarIcon,
            title: "Statistiques",
            description: "Suivez vos performances et votre croissance",
        },
        {
            icon: outline_1.CheckCircleIcon,
            title: "Checklist",
            description: "Gardez le contrôle de vos tâches quotidiennes",
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen font-['SF Pro Display']", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative min-h-screen bg-gradient-to-br from-primary-600 via-secondary-500 to-primary-500 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-grid-pattern opacity-10" }), (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 py-16 relative z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center min-h-[80vh] text-white", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { duration: 0.8, ease: "easeOut" }, className: "mb-8", children: (0, jsx_runtime_1.jsx)(lottie_react_1.default, { animationData: welcome_json_1.default, className: "w-64 h-64 md:w-72 md:h-72" }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 }, className: "text-center mb-12", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl md:text-6xl font-bold mb-6 tracking-tight", children: "Bienvenue sur FreelanceBox" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8", children: "La solution tout-en-un pour g\u00E9rer votre activit\u00E9 de freelance avec simplicit\u00E9 et professionnalisme." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-center gap-4", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: () => navigate("/login"), size: "lg", variant: "outline", className: "text-lg px-8 py-4 bg-white text-primary-600 hover:bg-white/90 hover:scale-105 transform transition-all duration-300 shadow-xl", children: "Se connecter" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: () => navigate("/register"), size: "lg", className: "text-lg px-8 py-4 bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 transform transition-all duration-300 shadow-xl", children: "S'inscrire" })] })] })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { y: [0, 10, 0] }, transition: { duration: 1.5, repeat: Infinity }, className: "absolute bottom-8 left-1/2 transform -translate-x-1/2", children: (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-10 border-2 border-white/50 rounded-full flex justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-1 h-3 bg-white/50 rounded-full mt-2" }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "py-20 bg-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "text-center mb-12", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-gray-900", children: "D\u00E9couvrez notre vid\u00E9o de pr\u00E9sentation" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto", children: "Regardez comment FreelanceBox peut vous aider \u00E0 g\u00E9rer votre activit\u00E9" })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6, delay: 0.3 }, className: "flex justify-center mb-12", children: (0, jsx_runtime_1.jsx)("div", { className: "cursor-pointer w-48 h-48 hover:scale-105 transition-transform duration-300", onClick: () => setShowVideo(true), children: (0, jsx_runtime_1.jsx)(lottie_react_1.default, { animationData: play_button_json_1.default, loop: true, className: "w-full h-full" }) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { ref: ref, className: "py-8 bg-gray-50", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: inView ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.6 }, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: features.map((feature, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: inView ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.6, delay: index * 0.1 }, className: "bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300", children: [(0, jsx_runtime_1.jsx)(feature.icon, { className: "w-12 h-12 text-primary-500 mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold mb-2 text-gray-900", children: feature.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: feature.description })] }, feature.title))) }) }) }), (0, jsx_runtime_1.jsx)(Modal_1.Modal, { isOpen: showVideo, onClose: () => setShowVideo(false), title: "Pr\u00E9sentation de FreelanceBox", children: (0, jsx_runtime_1.jsx)("div", { className: "aspect-video", children: (0, jsx_runtime_1.jsx)("iframe", { width: "100%", height: "100%", src: "https://www.youtube.com/embed/VOTRE_VIDEO_ID?autoplay=1", title: "Pr\u00E9sentation de FreelanceBox", frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true, className: "rounded-lg" }) }) }), (0, jsx_runtime_1.jsx)("footer", { className: "bg-gray-900 text-white py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 text-center", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: ["\u00A9 ", new Date().getFullYear(), " FreelanceBox. Tous droits r\u00E9serv\u00E9s. Chrsitophe Mostefaoui."] }) }) })] }));
};
exports.LandingPage = LandingPage;
