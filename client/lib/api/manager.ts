import { apiCall } from "./client";

export async function getProfile(accessToken: string) {
    const response = await apiCall("/api/managers/me");
    return response.json();
}
