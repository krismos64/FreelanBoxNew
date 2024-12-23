"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompanyStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useCompanyStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
    company: {
        name: '',
        address: '',
        postalCode: '',
        city: '',
        phone: '',
        email: '',
        website: '',
        siret: '',
    },
    updateCompany: (data) => set((state) => ({
        company: { ...state.company, ...data },
    })),
    updateLogo: (logo) => set((state) => ({
        company: { ...state.company, logo },
    })),
}), {
    name: 'company-storage',
}));
