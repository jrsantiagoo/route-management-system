import { RoutePlan } from "./types";

const STORAGE_KEY = "acesoft_savedRoutes";

export function loadSavedRoutes(): RoutePlan[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as RoutePlan[]) : [];
    } catch {
        return [];
    }
}

export function saveRoute(plan: RoutePlan): void {
    if (typeof window === "undefined") return;
    try {
        const all = loadSavedRoutes();
        const idx = all.findIndex((r) => r.id === plan.id);
        if (idx >= 0) {
            all[idx] = plan;
        } else {
            all.push(plan);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
        console.error("acesoft: failed to write to localStorage");
    }
}

export function deleteRoute(id: string): void {
    if (typeof window === "undefined") return;
    const remaining = loadSavedRoutes().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}
