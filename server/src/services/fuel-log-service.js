import prisma from "../lib/prisma.js";
import * as orderService from "./order-service.js";

export function buildDailyPerOrderMetrics(
    logs,
    orders,
    valueKey,
    totalKey,
    perOrderKey,
) {
    const buckets = {};

    for (const log of logs) {
        const dateKey = new Date(log.log_date).toISOString().split("T")[0];

        if (!buckets[dateKey]) {
            buckets[dateKey] = { [totalKey]: 0, orderCount: 0 };
        }

        buckets[dateKey][totalKey] += Number(log[valueKey] || 0);
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
            [totalKey]: data[totalKey],
            orderCount: data.orderCount,
            [perOrderKey]:
                data.orderCount > 0 ? data[totalKey] / data.orderCount : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

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
        orderBy: { log_date: "asc" },
    });
}

// --- DAILY FUEL CONSUMPTION PER ORDER ---
export async function dailyFuelPerOrder(startDate, endDate) {
    const fuelLogs = await getLogsRange(startDate, endDate);
    const orders = await orderService.getDeliveredOrdersRange(
        startDate,
        endDate,
    );

    return buildDailyPerOrderMetrics(
        fuelLogs,
        orders,
        "liters_added",
        "totalFuel",
        "fuelPerOrder",
    );
}

// --- DAILY DISTANCE TRAVELED PER ORDER ---
export async function dailyDistancePerOrder(startDate, endDate) {
    const fuelLogs = await getLogsRange(startDate, endDate);
    const orders = await orderService.getDeliveredOrdersRange(
        startDate,
        endDate,
    );

    return buildDailyPerOrderMetrics(
        fuelLogs,
        orders,
        "distance_traveled",
        "totalDistance",
        "distancePerOrder",
    );
}
