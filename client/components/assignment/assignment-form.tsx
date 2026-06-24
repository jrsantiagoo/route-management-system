"use client";

import { CirclePlus } from "lucide-react";

export default function AssignmentForm() {
    return (
        <div>
            <button
                className="flex items-center rounded-lg gap-2 px-3 py-1.5 bg-card text-sm font-medium 
                    border border-border text-foreground hover:bg-secondary dark:hover:text-primary transition"
            >
                <CirclePlus size={17} />
                Assign Route
            </button>
        </div>
    );
}
