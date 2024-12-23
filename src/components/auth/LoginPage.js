"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button_1 = require("@/components/ui/Button");
const input_1 = require("@/components/ui/input");
const react_hook_form_1 = require("react-hook-form");
const react_router_dom_1 = require("react-router-dom");
const LoginPage = () => {
    const { register, handleSubmit } = (0, react_hook_form_1.useForm)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const onSubmit = async (data) => {
        // Logique de connexion ici
        console.log(data);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-md w-full bg-white rounded-lg shadow-md p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-gray-900", children: "Connexion" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-600", children: "Connectez-vous \u00E0 votre compte" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "email", ...register("email"), className: "mt-1", placeholder: "votreemail@exemple.com" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Mot de passe" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "password", ...register("password"), className: "mt-1", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", className: "w-full", children: "Se connecter" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 text-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate("/register"), className: "text-sm text-primary-600 hover:text-primary-500", children: "Pas encore de compte ? S'inscrire" }) })] }) }));
};
exports.LoginPage = LoginPage;
