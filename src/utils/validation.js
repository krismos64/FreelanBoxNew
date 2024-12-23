"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = exports.clientSchema = void 0;
const zod_1 = require("zod");
exports.clientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
exports.projectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Project name is required'),
    clientId: zod_1.z.string().min(1, 'Client is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date().optional(),
    rate: zod_1.z.number().min(0, 'Rate must be positive'),
    currency: zod_1.z.string().min(1, 'Currency is required'),
    status: zod_1.z.enum(['pending', 'in-progress', 'completed', 'cancelled']),
});
