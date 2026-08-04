const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFuelPerOrder(startDate?: string, endDate?: string) {
    const response = await fetch(
        `${API_URL}/api/fuel_logs/daily_fuel_per_order`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ startDate, endDate }),
        },
    );
    return await response.json();
}

export async function getDistancePerOrder(startDate?: string, endDate?: string) {
    const response = await fetch(
        `${API_URL}/api/fuel_logs/daily_distance_per_order`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ startDate, endDate }),
        },
    );
    return await response.json();
}
