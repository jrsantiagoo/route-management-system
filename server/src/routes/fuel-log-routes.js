import { Router } from "express";

import * as fuelLogController from "../controllers/fuel-log-controller.js";

const router = Router();

router.get("/", fuelLogController.getAllLogs);
router.post("/", fuelLogController.createLog);
router.put("/:logId", fuelLogController.updateLog);
router.post("/daily_fuel_consumption", fuelLogController.dailyFuelPerOrder);

export default router;
