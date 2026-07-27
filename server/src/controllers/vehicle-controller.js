import * as vehicleService from "../services/vehicle-service.js";

export async function getVehicles(req, res) {
    try {
        const vehicles = await vehicleService.getVehicles();
        res.json({ success: true, data: vehicles });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function getVehicleById(req, res) {
    try {
        const { id } = req.params;
        const vehicle = await vehicleService.getVehicleById(id);
        res.json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function createVehicle(req, res) {
    try {
        const vehicle = req.body;
        const newVehicle = await vehicleService.createVehicle(vehicle);
        res.json({ success: true, data: newVehicle });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
