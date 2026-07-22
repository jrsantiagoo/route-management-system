const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getVehiclesNeedingFuel() {
    const response = await fetch(`${API_URL}/api/fleet/needs-fuel`);
    return await response.json();
}

export async function getVehiclesNeedingMaintenance() {
    const response = await fetch(`${API_URL}/api/fleet/needs-maintenance`);
    return await response.json();
}
