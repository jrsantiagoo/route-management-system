import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const routes = await prisma.route.findMany();
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

export default router;
