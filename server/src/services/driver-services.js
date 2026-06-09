import prisma from "../lib/prisma.js";

export async function getDrivers() {
    const drivers = await prisma.agent_profile.findMany({
        orderBy: {
            driver_id: "asc",
        },
    });
    return drivers;
}
