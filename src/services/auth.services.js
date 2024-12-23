"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = "http://localhost:8080/api/auth";
exports.authService = {
    async register(data) {
        const response = await axios_1.default.post(`${API_URL}/register`, data);
        return response.data;
    },
    async login(data) {
        const response = await axios_1.default.post(`${API_URL}/login`, data);
        return response.data;
    },
    async refreshToken(token) {
        const response = await axios_1.default.post(`${API_URL}/refresh-token`, {
            refreshToken: token,
        });
        return response.data;
    },
    async logout(refreshToken) {
        await axios_1.default.post(`${API_URL}/logout`, { refreshToken });
    },
};
