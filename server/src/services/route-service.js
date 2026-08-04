import prisma from "../lib/prisma.js";

export async function getAllRoutes() {
    return prisma.route.findMany({
        include: {
            stops: true,
        },
    });
}

export async function createRoute(route) {
    return prisma.route.create({
        data: {
            name: route.name,
            totalDistanceKm: route.totalDistanceKm,
            totalDurationMinutes: route.totalDurationMinutes,
            vehicleType: route.vehicleType,
            stops: {
                create: route.stops.map((stop, i) => ({
                    name: stop.name,
                    address: stop.address,
                    lat: stop.lat,
                    lng: stop.lng,
                    order: i,
                })),
            },
        },
        include: {
            stops: true,
        },
    });
}
