import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const managers = await prisma.manager.findMany();
        res.json({
            success: true,
            data: managers,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

export default router;
