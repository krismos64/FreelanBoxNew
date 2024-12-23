"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = exports.formatDate = void 0;
const date_fns_1 = require("date-fns");
const formatDate = (date) => {
    const parsedDate = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : date;
    return (0, date_fns_1.format)(parsedDate, 'MMM dd, yyyy');
};
exports.formatDate = formatDate;
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
