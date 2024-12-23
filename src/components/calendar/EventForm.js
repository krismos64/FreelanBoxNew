"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const zod_2 = require("zod");
const input_1 = require("@/components/ui/input");
const Button_1 = require("@/components/ui/Button");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const eventSchema = zod_2.z.object({
    title: zod_2.z.string().min(1, "Le titre est requis"),
    description: zod_2.z.string(),
    start: zod_2.z.string().min(1, "La date de début est requise"),
    end: zod_2.z.string().min(1, "La date de fin est requise"),
    color: zod_2.z.string().optional(),
    reminder: zod_2.z.number().min(0).optional(),
});
const EventForm = ({ onSubmit, onDelete, initialData, isSubmitting = false, }) => {
    const { register, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(eventSchema),
        defaultValues: initialData,
    });
    const handleDelete = () => {
        if (!initialData?.id)
            return;
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
            onDelete?.(initialData.id);
            react_hot_toast_1.default.success("Événement supprimé");
        }
    };
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { label: "Titre", ...register("title"), error: errors.title?.message }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Description", ...register("description"), error: errors.description?.message }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)(input_1.Input, { label: "D\u00E9but", type: "datetime-local", className: "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", ...register("start"), error: errors.start?.message }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Fin", type: "datetime-local", className: "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", ...register("end"), error: errors.end?.message }) })] }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Couleur", type: "color", ...register("color"), error: errors.color?.message }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Rappel (minutes avant)", type: "number", ...register("reminder", { valueAsNumber: true }), error: errors.reminder?.message }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3", children: [initialData && onDelete && ((0, jsx_runtime_1.jsx)(Button_1.Button, { type: "button", variant: "danger", onClick: handleDelete, children: "Supprimer" })), (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", variant: "gradient", isLoading: isSubmitting, children: initialData ? "Mettre à jour" : "Créer" })] }), (0, jsx_runtime_1.jsx)("style", { jsx: true, global: true, children: `
        input[type="datetime-local"] {
          position: relative;
          cursor: pointer;
          min-height: 38px;
          padding-right: 30px;
          color: inherit;
          background-color: inherit;
        }

        /* Styles pour le mode clair */
        input[type="datetime-local"] {
          font-size: 14px;
          line-height: 1.5;
        }

        /* Amélioration de l'apparence du sélecteur de date/heure */
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 8px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          background-color: transparent;
        }

        /* Styles pour le mode sombre */
        .dark input[type="datetime-local"] {
          color-scheme: dark;
        }

        .dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }

        .dark input[type="number"]::-webkit-inner-spin-button,
        .dark input[type="number"]::-webkit-outer-spin-button {
          filter: invert(1);
        }

        /* Assurer que le texte reste dans le cadre */
        input[type="datetime-local"],
        input[type="number"] {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      ` })] }));
};
exports.EventForm = EventForm;
