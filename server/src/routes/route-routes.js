import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const routes = await prisma.route.findMany({
            include: {
                stops: true,
            },
        });
        res.json({
            success: true,
            data: routes,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.post("/create-route", async (req, res) => {
    try {
        const { routeName, totalDistanceKm, totalDurationMin, stops } =
            req.body;
        const route = await prisma.route.create({
            data: {
                routeName,
                totalDistanceKm,
                totalDurationMin,
                stops: {
                    create: stops.map((stop) => ({
                        name: stop.name,
                        address: stop.address,
                        latitude: stop.latitude,
                        longitude: stop.longitude,
                        order: stop.order,
                    })),
                },
            },
        });
        res.json({
            success: true,
            data: route,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

export default router;
