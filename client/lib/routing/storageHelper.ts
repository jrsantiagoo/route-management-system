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

// Case-insensitive, trimmed check against saved route names. `excludeId` lets an
// existing route keep its own name when being re-saved.
export function isRouteNameTaken(name: string, excludeId?: string): boolean {
    const target = name.trim().toLowerCase();
    return loadSavedRoutes().some(
        (r) => r.id !== excludeId && r.name.trim().toLowerCase() === target,
    );
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

export function setRouteArchived(id: string, archived: boolean): void {
    if (typeof window === "undefined") return;
    const all = loadSavedRoutes().map((r) =>
        r.id === id ? { ...r, archived } : r,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
