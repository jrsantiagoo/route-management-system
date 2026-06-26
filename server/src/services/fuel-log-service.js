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

export async function dailyFuelConsumption(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const fuelLogs = await prisma.fuel_log.findMany({
        where: {
            log_date: { gte: start, lte: end },
            deleted_at: null,
        },
        select: {
            log_date: true,
            liters_added: true,
        },
        orderBy: { log_date: "asc" },
    });

    const buckets = {}; // { "2026-06-23": { totalFuel, totalDistance, count } }

    for (const log of fuelLogs) {
        // Extract just the date part, e.g. "2026-06-23"
        const dateKey = new Date(log.log_date).toISOString().split("T")[0];

        if (!buckets[dateKey]) {
            buckets[dateKey] = { totalFuel: 0, count: 0 };
        }
        buckets[dateKey].totalFuel += log.liters_added;
        buckets[dateKey].count += 1;
    }

    return Object.entries(buckets)
        .map(([date, data]) => ({
            date,
            totalFuel: data.totalFuel,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}
