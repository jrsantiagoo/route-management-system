import { Router } from "express";
import * as routeController from "../controllers/route-controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, routeController.getAllRoutes);
router.post("/", authenticate, routeController.createRoute);

export default router;
