import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  },

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    const response = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken: token,
    });
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await axios.post(`${API_URL}/logout`, { refreshToken });
  },
};
