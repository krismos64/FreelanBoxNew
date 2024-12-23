"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const input_1 = require("@/components/ui/input");
const Button_1 = require("@/components/ui/Button");
const outline_1 = require("@heroicons/react/24/outline");
const schema_1 = require("./schema");
const ClientForm = ({ onSubmit, initialData, isSubmitting = false, }) => {
    const fileInputRef = (0, react_1.useRef)(null);
    const { register, handleSubmit, setValue, watch, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(schema_1.clientSchema),
        defaultValues: initialData,
    });
    const logo = watch("logo");
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("logo", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 relative flex items-center justify-center border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer", onClick: () => fileInputRef.current?.click(), children: logo ? ((0, jsx_runtime_1.jsx)("img", { src: logo, alt: "Logo du client", className: "w-full h-full object-contain rounded-lg" })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(outline_1.PhotoIcon, { className: "mx-auto h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: "Cliquez pour ajouter un logo" })] })) }), (0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { label: "Nom", ...register("name"), error: errors.name?.message }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Email", type: "email", ...register("email"), error: errors.email?.message })] }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "T\u00E9l\u00E9phone", ...register("phone"), error: errors.phone?.message }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Adresse", ...register("address"), error: errors.address?.message }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { label: "Code postal", ...register("postalCode"), error: errors.postalCode?.message }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Ville", ...register("city"), error: errors.city?.message })] }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "SIRET (optionnel)", ...register("siret"), error: errors.siret?.message }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end space-x-3", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", variant: "gradient", isLoading: isSubmitting, children: initialData ? "Mettre à jour" : "Créer le client" }) })] }));
};
exports.ClientForm = ClientForm;
