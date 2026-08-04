import { Router } from "express";
import * as routeController from "../controllers/route-controller.js";

const router = Router();

router.get("/", routeController.getAllRoutes);
router.post("/", routeController.createRoute);

export default router;
