"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

// This layout wraps all protected pages (Dashboard, Route Tool, Assignment).
export default function protectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        const saved = localStorage.getItem("sidebar_collapsed");
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        const saved = localStorage.getItem("sidebar_collapsed");
        if (saved) setCollapsed(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("sidebar_collapsed", JSON.stringify(collapsed));
    }, [collapsed]);

    return (
        <div>
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed((c: any) => !c)}
            />
            <Topbar sidebarCollapsed={collapsed} />
            <main
                className={`${collapsed ? "ml-16" : "ml-64"} 
                    min-h-screen p-8 pt-23 bg-muted transition-[margin-left] duration-300`}
            >
                {children}
            </main>
        </div>
    );
}
