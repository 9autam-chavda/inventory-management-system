import api from "../api/api";

const authService = {

    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);

        localStorage.setItem("token", response.data.token);

        return response.data;
    },

    logout: () => {
        localStorage.removeItem("token");
    },

    getToken: () => {
        return localStorage.getItem("token");
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    }
};

export default authService;