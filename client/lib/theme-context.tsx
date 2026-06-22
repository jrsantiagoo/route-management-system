"use client";

import { createContext, useContext, useEffect, useState } from "react";

type theme = "light" | "dark";

interface ThemeContextValue {
    theme: theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme") as theme | null;
        if (saved) setTheme(saved);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    const toggleTheme = () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"));

    if (!mounted) return <>{children}</>;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
