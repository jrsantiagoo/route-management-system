"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, type ReactNode } from "react";

interface FormSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    icon?: ReactNode;
}

export default function FormSelect({
    value,
    onChange,
    options,
    placeholder,
    icon,
}: FormSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 w-full bg-background border border-border 
                    rounded-lg px-3 py-2 text-sm text-foreground 
                    focus:outline-none focus:ring-2 focus:ring-primary-foreground
                    hover:bg-secondary dark:hover:text-primary transition"
            >
                {icon && (
                    <span className="shrink-0 text-muted-foreground">
                        {icon}
                    </span>
                )}
                <span
                    className={`flex-1 text-left ${!value ? "text-muted-foreground" : ""}`}
                >
                    {value || placeholder}
                </span>
                <ChevronDown
                    size={14}
                    className={`shrink-0 text-muted-foreground transition 
                        ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div
                    className="overflow-auto absolute left-0 top-full z-10 mt-1 w-full max-h-48 
                    rounded-lg border border-border bg-card shadow shadow-muted-foreground
                    scrollbar-thumb-muted-foreground"
                >
                    {options.map((opt) => (
                        <button
                            type="button"
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-sm text-left transition 
                                hover:bg-secondary dark:hover:text-primary
                                first:rounded-t-lg last:rounded-b-lg
                                ${
                                    value === opt
                                        ? "bg-primary dark:bg-primary-foreground/35 text-foreground"
                                        : ""
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
