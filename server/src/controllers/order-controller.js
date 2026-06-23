import * as orderService from "../services/order-service.js";

export async function getAllOrders(req, res) {
    try {
        const orders = await orderService.getAllOrders();
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function createOrder(req, res) {
    try {
        const { client, destination, orderedOn, packageContent } = req.body;

        const result = await orderService.createOrder(
            client,
            destination,
            orderedOn,
            packageContent,
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
