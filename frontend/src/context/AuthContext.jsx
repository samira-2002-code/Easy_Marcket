import { useState } from "react";
import { AuthContext } from "./AuthContextValue";
import * as authService from "../services/authService";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(
        () => localStorage.getItem("token") || null
    );

    const saveSession = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        setToken(data.token);
        setUser(data.user);
    };

    const login = async (credentials) => {
        const data = await authService.login(credentials);

        saveSession(data);

        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);

        return data;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch {
            // Déconnexion locale même si l'API échoue
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}