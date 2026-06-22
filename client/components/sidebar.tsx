"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/dist/client/link";
import {
    LayoutDashboard,
    Map,
    ClipboardList,
    LogOut,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/route-tool", label: "Routing Tool", icon: Map },
    { href: "/assignment", label: "Assignment", icon: ClipboardList },
];

// This component renders the sidebar with navigation links.
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    // This allows us to highlight the active page in sidebar.
    const pathname = usePathname();

    return (
        // The sidebar is fixed to the left of the screen
        <div
            className={`fixed top-0 left-0 h-screen 
                ${collapsed ? "w-16" : "w-64"} 
                font-semibold border-r border-border`}
        >
            <div className="h-14 border-b border-border"></div>

            {/* Formats the nav links and highlights the active page */}
            <div className="flex flex-col gap-1 p-2 pt-4 flex-1 border-b border-border">
                {navLinks.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 rounded-md p-3 text-sm
                                ${active ? "bg-gray-400" : "hover:bg-secondary"}
                                ${collapsed ? "justify-center" : ""}`}
                            title={collapsed ? label : undefined}
                        >
                            <Icon size={17} />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Allows user to collapse sidebar (v.1)*/}
            <div className="flex justify-center">
                <button
                    onClick={onToggle}
                    className="absolute -right-3 top-57 flex items-center justify-center 
                        w-8 h-8 rounded-full border border-border bg-background
                        hover:bg-secondary"
                >
                    {collapsed ? (
                        <ChevronsRight size={20} />
                    ) : (
                        <ChevronsLeft size={20} />
                    )}
                </button>
            </div>
        </div>
    );
}
