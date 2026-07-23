import { apiCall } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDrivers() {
    const response = await apiCall("/api/drivers");
    return response.json();
}
