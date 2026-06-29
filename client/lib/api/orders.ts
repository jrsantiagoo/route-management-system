const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrders() {
    const response = await fetch(`${API_URL}/api/orders`);
    return await response.json();
}
