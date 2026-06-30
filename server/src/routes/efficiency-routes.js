import { Router } from "express";
import * as efficiencyController from "../controllers/efficiency-controller.js";

const router = Router();

router.post("/", efficiencyController.getEfficiency);

export default router;
