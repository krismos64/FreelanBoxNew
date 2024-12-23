"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSchema = void 0;
const zod_1 = require("zod");
exports.clientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Le nom est requis'),
    email: zod_1.z.string().email('Email invalide'),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().min(1, 'L\'adresse est requise'),
    postalCode: zod_1.z.string().min(1, 'Le code postal est requis'),
    city: zod_1.z.string().min(1, 'La ville est requise'),
    siret: zod_1.z.string().optional(),
    logo: zod_1.z.string().optional(),
});
