import { Router } from "express";
import * as routeController from "../controllers/route-controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, routeController.getAllRoutes);
router.post("/", authenticate, routeController.createRoute);
router.patch("/archive/:id_", authenticate, routeController.archiveRoute);
router.patch("/unarchive/:id_", authenticate, routeController.unarchiveRoute);

export default router;
