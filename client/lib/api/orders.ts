const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrders() {
    const response = await fetch(`${API_URL}/api/orders`);
    return await response.json();
}

export async function getOrdersRange(startDate?: string, endDate?: string) {
    const response = await fetch(`${API_URL}/api/orders/orders_date_range`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
    });
    return await response.json();
}
