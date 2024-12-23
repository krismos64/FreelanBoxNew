"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthName = exports.formatFullDateTime = exports.formatDateRange = exports.getFormattedDate = void 0;
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const getFormattedDate = () => {
    return (0, date_fns_1.format)(new Date(), "dd MMMM yyyy", { locale: locale_1.fr });
};
exports.getFormattedDate = getFormattedDate;
const formatDateRange = (start, end) => {
    return `${(0, date_fns_1.format)(start, 'HH:mm', { locale: locale_1.fr })} - ${(0, date_fns_1.format)(end, 'HH:mm', { locale: locale_1.fr })}`;
};
exports.formatDateRange = formatDateRange;
const formatFullDateTime = (date) => {
    return (0, date_fns_1.format)(date, "dd MMMM yyyy 'à' HH:mm", { locale: locale_1.fr });
};
exports.formatFullDateTime = formatFullDateTime;
const getMonthName = (date) => {
    return (0, date_fns_1.format)(date, 'MMMM yyyy', { locale: locale_1.fr });
};
exports.getMonthName = getMonthName;
