"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuoteStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const date_fns_1 = require("date-fns");
exports.useQuoteStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    quotes: [],
    settings: {
        prefix: 'DEV',
        nextNumber: 1,
        defaultValidityDays: 30,
        defaultNotes: '',
        defaultTermsAndConditions: 'TVA non applicable, article 293 B du CGI.',
    },
    addQuote: (data) => {
        const newQuote = {
            id: crypto.randomUUID(),
            number: get().generateQuoteNumber(),
            date: data.date,
            validUntil: data.validUntil,
            status: 'draft',
            client: data.client,
            items: data.items.map(item => ({
                id: crypto.randomUUID(),
                ...item,
                total: item.quantity * item.unitPrice
            })),
            total: data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
            notes: data.notes,
            termsAndConditions: data.termsAndConditions,
        };
        set(state => ({
            quotes: [...state.quotes, newQuote],
            settings: {
                ...state.settings,
                nextNumber: state.settings.nextNumber + 1,
            },
        }));
        return newQuote;
    },
    updateQuote: (id, data) => set(state => ({
        quotes: state.quotes.map(quote => quote.id === id ? { ...quote, ...data } : quote),
    })),
    deleteQuotes: (ids) => set(state => ({
        quotes: state.quotes.filter(quote => !ids.includes(quote.id)),
    })),
    updateQuoteStatus: (id, status) => set(state => ({
        quotes: state.quotes.map(quote => quote.id === id ? { ...quote, status } : quote),
    })),
    getQuoteById: (id) => get().quotes.find(quote => quote.id === id),
    updateSettings: (newSettings) => set(state => ({
        settings: { ...state.settings, ...newSettings },
    })),
    generateQuoteNumber: () => {
        const { prefix, nextNumber } = get().settings;
        const year = (0, date_fns_1.format)(new Date(), 'yyyy');
        const month = (0, date_fns_1.format)(new Date(), 'MM');
        const paddedNumber = String(nextNumber).padStart(3, '0');
        return `${prefix}-${year}-${month}-${paddedNumber}`;
    },
}), {
    name: 'quotes-storage',
}));
