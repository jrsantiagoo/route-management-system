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