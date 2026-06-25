import prisma from "../lib/prisma.js";

export async function getAllLogs() {
    return prisma.fuel_log.findMany();
}

export async function createFuelLog(data) {
    return prisma.fuel_log.create({
        data,
    });
}

export async function updateFuelLog(logId, updatedFields) {
    const fuelLog = await prisma.fuel_log.findUnique({
        where: { id_: logId },
    });

    if (!fuelLog) throw new Error("Fuel log record not found");

    return prisma.fuel_log.update({
        where: { id_: logId },
        data: updatedFields,
    });
}
