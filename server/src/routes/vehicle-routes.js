import { Router } from "express";
import { authenticate } from "../middleware/auth.js";

import * as vehicleController from "../controllers/vehicle-controller.js";

const router = Router();

router.get("/", authenticate, vehicleController.getVehicles);
router.get("/:id", authenticate, vehicleController.getVehicleById);


export default router;
