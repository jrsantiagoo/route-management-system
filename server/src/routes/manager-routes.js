import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";

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

router.get("/me", authenticate, async (req, res) => {
    try {
        const manager = await prisma.manager.findUnique({
            // from Supabase token
            where: { id_: req.user.user.id },
        });
        if (!manager)
            return res.status(404).json({ error: "Manager not found" });
        res.json({
            success: true,
            data: manager,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
