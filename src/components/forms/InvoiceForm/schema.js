"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceSchema = void 0;
const zod_1 = require("zod");
const invoiceItemSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, 'La description est requise'),
    quantity: zod_1.z.number().min(1, 'La quantité doit être supérieure à 0'),
    unitPrice: zod_1.z.number().min(0, 'Le prix unitaire doit être positif'),
});
exports.invoiceSchema = zod_1.z.object({
    clientId: zod_1.z.string().min(1, 'Le client est requis'),
    date: zod_1.z.string().min(1, 'La date est requise'),
    dueDate: zod_1.z.string().min(1, 'La date d\'échéance est requise'),
    items: zod_1.z.array(invoiceItemSchema).min(1, 'Au moins un élément est requis'),
    notes: zod_1.z.string().optional(),
    termsAndConditions: zod_1.z.string().optional(),
});
