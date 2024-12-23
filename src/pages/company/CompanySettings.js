"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanySettings = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PageHeader_1 = require("@/components/ui/PageHeader");
const input_1 = require("@/components/ui/input");
const Button_1 = require("@/components/ui/Button");
const companyStore_1 = require("@/store/companyStore");
const outline_1 = require("@heroicons/react/24/outline");
const CompanySettings = () => {
    const fileInputRef = (0, react_1.useRef)(null);
    const { company, updateCompany, updateLogo } = (0, companyStore_1.useCompanyStore)();
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)(company);
    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        updateCompany(formData);
        setIsEditing(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(PageHeader_1.PageHeader, { title: "Param\u00E8tres de l'entreprise", buttonText: isEditing ? undefined : "Modifier", onButtonClick: () => setIsEditing(true) }), (0, jsx_runtime_1.jsx)("div", { className: "max-w-2xl mx-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 relative", children: company.logo ? ((0, jsx_runtime_1.jsx)("img", { src: company.logo, alt: "Logo de l'entreprise", className: "w-full h-full object-contain rounded-lg" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg", children: (0, jsx_runtime_1.jsx)(outline_1.PhotoIcon, { className: "w-12 h-12 text-gray-400" }) })) }), (0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: handleLogoChange, accept: "image/*", className: "hidden" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "button", variant: "secondary", onClick: () => fileInputRef.current?.click(), children: "Changer le logo" })] }), isEditing ? ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { label: "Nom de l'entreprise", name: "name", value: formData.name, onChange: handleChange }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Adresse", name: "address", value: formData.address, onChange: handleChange }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Code postal", name: "postalCode", value: formData.postalCode, onChange: handleChange }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Ville", name: "city", value: formData.city, onChange: handleChange }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "T\u00E9l\u00E9phone", name: "phone", value: formData.phone, onChange: handleChange }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Email", name: "email", type: "email", value: formData.email, onChange: handleChange }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "Site web", name: "website", value: formData.website, onChange: handleChange }), (0, jsx_runtime_1.jsx)(input_1.Input, { label: "SIRET", name: "siret", value: formData.siret, onChange: handleChange }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { type: "button", variant: "secondary", onClick: () => {
                                                setFormData(company);
                                                setIsEditing(false);
                                            }, children: "Annuler" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", children: "Enregistrer" })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(InfoRow, { label: "Nom", value: company.name }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Adresse", value: company.address }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Code postal", value: company.postalCode }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Ville", value: company.city }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "T\u00E9l\u00E9phone", value: company.phone }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Email", value: company.email }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "Site web", value: company.website }), (0, jsx_runtime_1.jsx)(InfoRow, { label: "SIRET", value: company.siret })] }))] }) })] }));
};
exports.CompanySettings = CompanySettings;
const InfoRow = ({ label, value, }) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between py-2 border-b dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: label }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-900 dark:text-white", children: value || "-" })] }));
