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
        const { route } = req.body;
        const newRoute = await prisma.route.create({
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
        res.json({
            success: true,
            data: newRoute,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

export default router;
