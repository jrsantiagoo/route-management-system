import { apiCall } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createTrip(
    routeId: string,
    driverId: string,
    scheduledDate?: string,
) {
    const response = await apiCall("/api/trips", {
        method: "POST",
        body: JSON.stringify({ routeId, driverId, scheduledDate }),
    });
    return response.json();
}

export async function deleteTrip(tripId: string) {
    const response = await apiCall(`/api/trips/${tripId}`, {
        method: "DELETE",
    });
    return response.json();
}

export async function getAllTrips() {
    const response = await apiCall("/api/trips");
    return response.json();
}

export async function getTripsRange(startDate?: string, endDate?: string) {
    const response = await apiCall("/api/trips/trips_date_range", {
        method: "POST",
        body: JSON.stringify({ startDate, endDate }),
    });
    return await response.json();
}

export async function getTripsByDriver(driverId: string) {
    const response = await apiCall(`/api/trips/driver/${driverId}`);
    return response.json();
}

export async function getAssignmentGrid() {
    const response = await apiCall("/api/trips/assignment-grid");
    return response.json();
}
