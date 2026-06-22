"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

// This layout wraps all protected pages (Dashboard, Route Tool, Assignment).
export default function protectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div>
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed((c) => !c)}
            />
            <Topbar sidebarCollapsed={collapsed} />
            <main
                className={`${collapsed ? "ml-16" : "ml-64"} 
                    min-h-screen p-8 bg-gray-100 bg-muted transition-all duration-300`}
            >
                {children}
            </main>
        </div>
    );
}
