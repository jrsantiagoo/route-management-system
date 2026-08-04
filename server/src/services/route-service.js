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

export async function archiveRoute(id_) {
    return prisma.route.update({
        where: { id_: id_ },
        data: {
            archivedAt: new Date(),
        },
    });
}

export async function unarchiveRoute(id_) {
    return prisma.route.update({
        where: { id_: id_ },
        data: {
            archivedAt: null,
        },
    });
}
