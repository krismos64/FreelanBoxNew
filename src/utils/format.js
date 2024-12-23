"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = exports.formatDateTime = exports.formatDate = void 0;
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return (0, date_fns_1.format)(dateObj, 'dd MMMM yyyy', { locale: locale_1.fr });
};
exports.formatDate = formatDate;
const formatDateTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return (0, date_fns_1.format)(dateObj, 'dd MMMM yyyy HH:mm', { locale: locale_1.fr });
};
exports.formatDateTime = formatDateTime;
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
