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

export async function updateOrderPackageInfo(req, res) {
    try {
        const { orderId } = req.params;
        const { package_weight, package_size } = req.body;

        const updatedFields = {};
        if (package_weight !== undefined)
            updatedFields.package_weight = package_weight;
        if (package_size !== undefined)
            updatedFields.package_size = package_size;

        const result = await orderService.updateOrder(orderId, updatedFields);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status, delivered_by } = req.body;

        const updatedFields = {};
        if (status !== undefined) updatedFields.status = status.toUpperCase();
        if (delivered_by !== undefined)
            updatedFields.delivered_by = delivered_by;

        const result = await orderService.updateOrder(orderId, updatedFields);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
