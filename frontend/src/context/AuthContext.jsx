import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const access = localStorage.getItem("access");
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        if (access) {
            try {
                const decoded = jwtDecode(access);
                return { username, email, ...decoded };
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const login = (tokens, userData) => {
        localStorage.setItem("access", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);
        if (userData) {
            localStorage.setItem("username", userData.username);
            localStorage.setItem("email", userData.email);
        }

        try {
            const decoded = jwtDecode(tokens.access);
            setUser({
                username: userData?.username || localStorage.getItem("username"),
                email: userData?.email || localStorage.getItem("email"),
                ...decoded
            });
        } catch (e) {
            setUser({
                username: userData?.username,
                email: userData?.email,
            });
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
