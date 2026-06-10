const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProfile(accessToken: string) {
    const response = await fetch(`${API_URL}/api/managers/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.json();
}
