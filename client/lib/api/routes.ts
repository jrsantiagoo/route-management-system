import { RoutePlan } from "../routing/types";
import { apiCall } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRoutes() {
    const response = await apiCall("/api/routes");
    return await response.json();
}

export async function createRoute(route: RoutePlan) {
    const response = await apiCall("/api/routes", {
        method: "POST",
        body: JSON.stringify(route),
    });
    return response.json();
}
