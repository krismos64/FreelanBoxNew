"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteSchema = void 0;
const zod_1 = require("zod");
const quoteItemSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, 'La description est requise'),
    quantity: zod_1.z.number().min(1, 'La quantité doit être supérieure à 0'),
    unitPrice: zod_1.z.number().min(0, 'Le prix unitaire doit être positif'),
});
exports.quoteSchema = zod_1.z.object({
    clientId: zod_1.z.string().min(1, 'Le client est requis'),
    date: zod_1.z.string().min(1, 'La date est requise'),
    validUntil: zod_1.z.string().min(1, 'La date de validité est requise'),
    items: zod_1.z.array(quoteItemSchema).min(1, 'Au moins un élément est requis'),
    notes: zod_1.z.string().optional(),
    termsAndConditions: zod_1.z.string().min(1, 'Les conditions sont requises'),
});
