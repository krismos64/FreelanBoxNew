"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useThemeStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
    isDarkMode: false,
    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}), {
    name: 'theme-storage',
}));
