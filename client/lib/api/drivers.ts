const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDrivers() {
    const response = await fetch(`${API_URL}/api/drivers`);
    return response.json();
}
