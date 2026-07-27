import prisma from "../lib/prisma.js";

export async function getVehicles() {
    return prisma.vehicle.findMany({
        where: { deleted_at: null },
        include: { agent_profile: true },
        orderBy: { created_at: "desc" },
    });
}

export async function getVehicleById(vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({
        where: { id_ : vehicleId },
        include: { agent_profile: true, fuel_log: true, trip: true },
    });
    if (!vehicle) throw new Error("Vehicle not found");
    return vehicle;
}

export async function createVehicle(vehicle) {
    return prisma.vehicle.create({
        data: {
            plate_number: vehicle.plate_number,
            year: Number(vehicle.year),
            vehicle_type: vehicle.vehicle_type ?? null,
            weight_capacity: vehicle.weight_capacity
                ? Number(vehicle.weight_capacity)
                : null,
            initial_odometer: Number(vehicle.initial_odometer),
            last_odometer: vehicle.last_odometer
                ? Number(vehicle.last_odometer)
                : null,
            expected_kml: Number(vehicle.expected_kml),
            target_efficiency: vehicle.target_efficiency
                ? Number(vehicle.target_efficiency)
                : null,
            conduction_sticker: vehicle.conduction_sticker ?? null,
            reg_certification: vehicle.reg_certification ?? null,
            or_number: vehicle.or_number ?? null,
            registration_expiry: vehicle.registration_expiry
                ? new Date(vehicle.registration_expiry)
                : null,
            insurance_expiry: vehicle.insurance_expiry
                ? new Date(vehicle.insurance_expiry)
                : null,
            is_active: vehicle.is_active ?? true,
            driver_id_: vehicle.driver_id_ ?? null,
            make_id_: vehicle.make_id_ ?? null,
            model_id_: vehicle.model_id_ ?? null,
        },
        include: {
            vehicle_make: true,
            vehicle_model: true,
        },
    });
}