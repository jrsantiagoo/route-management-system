import { Router } from "express";
import { getDrivers } from "../controllers/driver-controller.js";

const router = Router();

router.get("/", getDrivers);

export default router;
