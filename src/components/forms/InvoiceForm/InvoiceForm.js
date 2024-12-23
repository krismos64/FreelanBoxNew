"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const input_1 = require("@/components/ui/input");
const Button_1 = require("@/components/ui/Button");
const ClientSelect_1 = require("@/components/forms/shared/ClientSelect");
const outline_1 = require("@heroicons/react/24/outline");
const schema_1 = require("./schema");
const InvoiceForm = ({ onSubmit, initialData, isSubmitting = false, convertedFromQuote = false, }) => {
    // Fonction pour obtenir la date du jour au format YYYY-MM-DD
    const getCurrentDate = () => {
        return new Date().toISOString().split("T")[0];
    };
    // Fonction pour obtenir la date d'échéance (1 mois plus tard)
    const getDueDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split("T")[0];
    };
    const { register, control, handleSubmit, watch, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(schema_1.invoiceSchema),
        defaultValues: {
            items: [{ description: "", quantity: 1, unitPrice: 0 }],
            date: getCurrentDate(),
            dueDate: getDueDate(),
            termsAndConditions: "TVA non applicable, article 293 B du CGI.",
            ...initialData,
        },
    });
    const { fields, append, remove } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: "items",
    });
    const items = watch("items");
    const total = items?.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0) || 0;
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(ClientSelect_1.ClientSelect, { label: "Client", ...register("clientId"), error: errors.clientId?.message, disabled: convertedFromQuote }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { label: "Date", type: "date", ...register("date"), error: errors.date?.message }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Date d'\u00E9ch\u00E9ance", type: "date", ...register("dueDate"), error: errors.dueDate?.message })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "\u00C9l\u00E9ments de la facture" }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { type: "button", variant: "secondary", size: "sm", onClick: () => append({ description: "", quantity: 1, unitPrice: 0 }), children: [(0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-4 w-4 mr-2" }), "Ajouter un \u00E9l\u00E9ment"] })] }), fields.map((field, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-12 gap-4 items-start bg-gray-50 dark:bg-gray-800 p-4 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "col-span-12 md:col-span-6", children: (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Description", ...register(`items.${index}.description`), error: errors.items?.[index]?.description?.message, multiline: true, rows: 2 }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-6 md:col-span-2", children: (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Quantit\u00E9", type: "number", min: "1", ...register(`items.${index}.quantity`, {
                                        valueAsNumber: true,
                                    }), error: errors.items?.[index]?.quantity?.message }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-6 md:col-span-3", children: (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Prix unitaire TTC", type: "number", step: "0.01", min: "0", ...register(`items.${index}.unitPrice`, {
                                        valueAsNumber: true,
                                    }), error: errors.items?.[index]?.unitPrice?.message }) }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-12 md:col-span-1 flex md:pt-7 justify-end", children: index > 0 && ((0, jsx_runtime_1.jsx)(Button_1.Button, { type: "button", variant: "danger", size: "sm", onClick: () => remove(index), children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-4 w-4" }) })) })] }, field.id)))] }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Notes", ...register("notes"), error: errors.notes?.message, multiline: true, rows: 3 }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Conditions et mentions l\u00E9gales", ...register("termsAndConditions"), error: errors.termsAndConditions?.message, multiline: true, rows: 3 }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: ["Total TTC :", " ", new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                            }).format(total)] }), (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-3", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", variant: "gradient", isLoading: isSubmitting, children: initialData ? "Mettre à jour" : "Créer la facture" }) })] })] }));
};
exports.InvoiceForm = InvoiceForm;
