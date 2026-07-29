import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getDrivers } from "../controllers/driver-controller.js";

const router = Router();

router.get("/", authenticate, getDrivers);

export default router;
