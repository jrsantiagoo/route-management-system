"use client";

import { useEffect, useState } from "react";
import { usePersistedState } from "@/lib/hooks/use-persisted-state";
import Sidebar from "@/components/ui/sidebar";
import Topbar from "@/components/ui/topbar";

let cachedCollapsed: boolean | null = null;

// This layout wraps all protected pages (Dashboard, Route Tool, Assignment).
export default function protectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed, ready] = usePersistedState(
        "sidebar_collapsed",
        false,
    );

    // Render with collapsed state, before reading localStorage to avoid flash
    const effectiveCollapsed = ready ? collapsed : true;

    return (
        <div>
            <Sidebar
                collapsed={effectiveCollapsed}
                onToggle={() => setCollapsed((c) => !c)}
            />
            <Topbar sidebarCollapsed={effectiveCollapsed} />
            <main
                className={`${effectiveCollapsed ? "ml-20" : "ml-64"}
                    min-h-screen p-8 pt-23 bg-background text-foreground 
                    transition-[margin-left] duration-300`}
            >
                {children}
            </main>
        </div>
    );
}
