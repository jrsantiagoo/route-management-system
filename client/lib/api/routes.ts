import { RoutePlan } from "../routing/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRoutes() {
    const response = await fetch(`${API_URL}/api/routes`);
    return await response.json();
}

export async function createRoute(route: RoutePlan) {
    const response = await fetch(`${API_URL}/api/routes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(route),
    });
    return response.json();
}