import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:8000/api",

    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Laisser Axios/navigateur gérer automatiquement
    // le Content-Type pour FormData.
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }

    return config;
});

export default api;