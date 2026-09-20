import { useState } from "react";
import * as authService from "../services/authService";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() =>
        localStorage.getItem("token") || null
    );

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const saveSession = (response) => {
        const sessionToken =
            response?.token || response?.data?.token || null;
        const sessionUser =
            response?.user || response?.data?.user || null;

        if (sessionToken) {
            localStorage.setItem("token", sessionToken);
            setToken(sessionToken);
        }

        if (sessionUser) {
            localStorage.setItem(
                "user",
                JSON.stringify(sessionUser)
            );
            setUser(sessionUser);
        }
    };

    const login = async (credentials) => {
        const response = await authService.login(credentials);

        saveSession(response);

        return response;
    };

    const register = async (data) => {
        const response = await authService.register(data);

        saveSession(response);

        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                register,
                logout,
                token,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
