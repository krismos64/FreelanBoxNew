"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvoiceStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const date_fns_1 = require("date-fns");
const statisticsStore_1 = require("@/store/statisticsStore");
const clientStore_1 = require("@/store/clientStore");
const invoiceMiddleware = (config) => (set, get, api) => {
    const initialState = config(set, get, api);
    return {
        ...initialState,
        updateInvoice: (id, data) => {
            const previousInvoice = get().invoices.find((inv) => inv.id === id);
            const previousStatus = previousInvoice?.status;
            set((state) => ({
                invoices: state.invoices.map((invoice) => invoice.id === id
                    ? {
                        ...invoice,
                        ...data,
                        total: data.items?.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0) || invoice.total,
                    }
                    : invoice),
            }));
            const updatedInvoice = get().invoices.find((inv) => inv.id === id);
            if (data.status !== undefined && data.status !== previousStatus) {
                statisticsStore_1.useStatisticsStore
                    .getState()
                    .updateFromInvoice(updatedInvoice, previousStatus);
                if (updatedInvoice.client) {
                    clientStore_1.useClientStore
                        .getState()
                        .updateClientRevenue(updatedInvoice.client.id, updatedInvoice, previousStatus);
                }
            }
        },
    };
};
exports.useInvoiceStore = (0, zustand_1.create)()((0, middleware_1.persist)(invoiceMiddleware((set, get) => ({
    invoices: [],
    settings: {
        prefix: "INV",
        nextNumber: 1,
        defaultDueDays: 30,
        defaultNotes: "",
        defaultTermsAndConditions: "TVA non applicable, article 293 B du CGI.",
    },
    addInvoice: (data) => {
        const total = data.items?.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0) || 0;
        const newInvoice = {
            id: crypto.randomUUID(),
            number: get().generateInvoiceNumber(),
            date: data.date || new Date().toISOString(),
            dueDate: data.dueDate || new Date().toISOString(),
            status: "draft",
            client: data.client,
            items: data.items?.map((item) => ({
                ...item,
                id: crypto.randomUUID(),
                total: (item.unitPrice || 0) * (item.quantity || 0),
            })) || [],
            total,
            notes: data.notes || "",
            termsAndConditions: data.termsAndConditions || "",
        };
        set((state) => ({
            invoices: [...state.invoices, newInvoice],
            settings: {
                ...state.settings,
                nextNumber: state.settings.nextNumber + 1,
            },
        }));
        if (newInvoice.status === "paid") {
            statisticsStore_1.useStatisticsStore.getState().updateFromInvoice(newInvoice);
            if (newInvoice.client) {
                clientStore_1.useClientStore
                    .getState()
                    .updateClientRevenue(newInvoice.client.id, newInvoice, null);
            }
        }
        return newInvoice;
    },
    deleteInvoices: (ids) => {
        const invoicesToDelete = get().invoices.filter((invoice) => ids.includes(invoice.id) ||
            ids.includes(`temp-id-${get().invoices.indexOf(invoice)}`));
        invoicesToDelete.forEach((invoice) => {
            if (invoice.status === "paid") {
                statisticsStore_1.useStatisticsStore
                    .getState()
                    .updateFromInvoice({ ...invoice, status: "draft" }, "paid");
                if (invoice.client) {
                    clientStore_1.useClientStore
                        .getState()
                        .updateClientRevenue(invoice.client.id, { ...invoice, status: "draft" }, "paid");
                }
            }
        });
        set((state) => ({
            invoices: state.invoices.filter((invoice) => !ids.includes(invoice.id) &&
                !ids.includes(`temp-id-${state.invoices.indexOf(invoice)}`)),
        }));
    },
    generateInvoiceNumber: () => {
        const { prefix, nextNumber } = get().settings;
        const year = (0, date_fns_1.format)(new Date(), "yyyy");
        const month = (0, date_fns_1.format)(new Date(), "MM");
        const paddedNumber = String(nextNumber).padStart(3, "0");
        set((state) => ({
            settings: { ...state.settings, nextNumber: nextNumber + 1 },
        }));
        return `${prefix}-${year}-${month}-${paddedNumber}`;
    },
    updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
    })),
})), {
    name: "invoices-storage",
}));
