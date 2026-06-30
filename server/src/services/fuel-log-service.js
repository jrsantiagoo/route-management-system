import prisma from "../lib/prisma.js";
import * as orderdService from "./order-service.js";

// --- ALL FUEL LOGS ---
export async function getAllLogs() {
    return prisma.fuel_log.findMany({
        orderBy: { created_at: "desc" },
    });
}

// --- CREATE LOG ---
export async function createFuelLog(data) {
    return prisma.fuel_log.create({
        data,
    });
}

// --- UPDATE LOG ---
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

// --- GET LOGS GIVEN A DATE RANGE ---
export async function getLogsRange(startDate, endDate) {
    const dateFilter = {};
    // In case a start or end date is not given
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
        // Set to the end of the day instead of the start of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
    }

    return prisma.fuel_log.findMany({
        where: {
            deleted_at: null,
            ...(Object.keys(dateFilter).length > 0 && { log_date: dateFilter }),
        },
        select: {
            log_date: true,
            liters_added: true,
        },
        orderBy: { log_date: "asc" },
    });
}

// --- DAILY FUEL CONSUMPTION PER ORDER ---
export async function dailyFuelPerOrder(startDate, endDate) {
    const fuelLogs = await getLogsRange(startDate, endDate);
    const orders = await orderdService.getDeliveredOrdersRange(
        startDate,
        endDate,
    );

    // Grouping by day
    const buckets = {}; // { "2026-06-23": { totalFuel, totalDistance, count } }

    for (const log of fuelLogs) {
        // Extract just the date part, e.g. "2026-06-23"
        const dateKey = new Date(log.log_date).toISOString().split("T")[0];

        if (!buckets[dateKey]) {
            buckets[dateKey] = { totalFuel: 0, orderCount: 0 };
        }
        buckets[dateKey].totalFuel += log.liters_added;
        buckets[dateKey].count += 1;
    }

    for (const order of orders) {
        const dateKey = new Date(order.delivered_by)
            .toISOString()
            .split("T")[0];

        if (!buckets[dateKey]) continue;

        buckets[dateKey].orderCount += 1;
    }

    return Object.entries(buckets)
        .map(([date, data]) => ({
            date,
            totalFuel: data.totalFuel,
            orderCount: data.orderCount,
            fuelPerOrder:
                data.orderCount > 0 ? data.totalFuel / data.orderCount : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}
