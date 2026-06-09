import * as driverService from "../services/driver-services.js";

export async function getDrivers(req, res) {
    try {
        const drivers = await driverService.getDrivers();
        res.json({
            success: true,
            data: drivers,
        });
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({ error: error.message });
    }
}
