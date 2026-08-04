const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getEfficiency(startDate?: string, endDate?: string) {
    const response = await fetch(`${API_URL}/api/efficiency`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
    });
    return await response.json();
}
