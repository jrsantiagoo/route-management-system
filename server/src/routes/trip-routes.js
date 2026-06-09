import { Router } from "express";
import {
  assignTripToDriver,
  changeTripStatus,
  getTripsForDriver,
  getTripDetail,
} from "../controllers/trip-controller.js";

const router = Router();

router.post("/assign", assignTripToDriver);
router.patch("/:id/status", changeTripStatus);
router.get("/driver/:driverId", getTripsForDriver);
router.get("/:id", getTripDetail);

export default router;
