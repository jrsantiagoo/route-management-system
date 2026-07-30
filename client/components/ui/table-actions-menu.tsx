"use client";

import { forwardRef, type ReactNode } from "react";

export interface ActionItem {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    variant?: "default" | "danger";
}

interface TableActionsMenuProps {
    actions: ActionItem[];
}

export const TableActionsMenu = forwardRef<
    HTMLDivElement,
    TableActionsMenuProps
>(({ actions }, ref) => (
    <div
        ref={ref}
        className="absolute right-0 mt-1 mr-8 w-44 bg-card border border-border 
                rounded-lg shadow-sm shadow-muted-foreground z-30 px-1 py-1"
    >
        {actions.map((a) => (
            <button
                key={a.label}
                onClick={a.onClick}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition
                        ${
                            a.variant === "danger"
                                ? "text-red-500 hover:bg-secondary hover:text-red-600"
                                : "text-foreground hover:bg-secondary hover:text-primary-foreground dark:hover:text-primary"
                        }`}
            >
                {a.icon}
                {a.label}
            </button>
        ))}
    </div>
));

TableActionsMenu.displayName = "TableActionsMenu";
