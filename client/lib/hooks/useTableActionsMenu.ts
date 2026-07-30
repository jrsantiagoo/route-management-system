"use client";

import { useEffect, useRef, useState } from "react";

// Used for a table's Actions Menu
export function useTableActionsMenu() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node))
                setActiveMenu(null);
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return { activeMenu, setActiveMenu, menuRef };
}
