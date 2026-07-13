import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if ((status === 401 || status === 403) && localStorage.getItem("token")) {
            localStorage.removeItem("token");

            if (window.location.pathname !== "/" && window.location.pathname !== "/login") {
                window.location.replace("/");
            }
        }

        return Promise.reject(error);
    }
);

export default api;
