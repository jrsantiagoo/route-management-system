import * as routeService from "../services/route-service.js";

export async function getAllRoutes(req, res) {
    try {
        const routes = await routeService.getAllRoutes();
        res.json({ success: true, data: routes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function createRoute(req, res) {
    try {
        const route = req.body;
        const newRoute = await routeService.createRoute(route);

        res.json({ success: true, data: newRoute });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
