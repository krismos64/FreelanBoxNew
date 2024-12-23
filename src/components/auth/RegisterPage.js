"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button_1 = require("@/components/ui/Button");
const input_1 = require("@/components/ui/input");
const react_hook_form_1 = require("react-hook-form");
const react_router_dom_1 = require("react-router-dom");
const auth_services_1 = require("@/services/auth.services");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const onSubmit = async (data) => {
        try {
            await auth_services_1.authService.register(data);
            react_hot_toast_1.default.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            navigate("/login");
        }
        catch (error) {
            react_hot_toast_1.default.error(error.response?.data?.message ||
                "Une erreur est survenue lors de l'inscription");
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Inscription" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Cr\u00E9ez votre compte FreelanceBox" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Nom" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "name", type: "text", ...register("name", {
                                        required: "Le nom est requis",
                                        minLength: {
                                            value: 2,
                                            message: "Le nom doit contenir au moins 2 caractères",
                                        },
                                    }), className: "mt-1", placeholder: "John Doe", error: errors.name?.message })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Email" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "email", type: "email", ...register("email", {
                                        required: "L'email est requis",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email invalide",
                                        },
                                    }), className: "mt-1", placeholder: "john@exemple.com", error: errors.email?.message })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Mot de passe" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "password", type: "password", ...register("password", {
                                        required: "Le mot de passe est requis",
                                        minLength: {
                                            value: 6,
                                            message: "Le mot de passe doit contenir au moins 6 caractères",
                                        },
                                    }), className: "mt-1", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", error: errors.password?.message })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", className: "w-full", disabled: isSubmitting, children: isSubmitting ? "Inscription..." : "S'inscrire" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 text-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate("/login"), className: "text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300", children: "D\u00E9j\u00E0 un compte ? Se connecter" }) })] }) }));
};
exports.RegisterPage = RegisterPage;
