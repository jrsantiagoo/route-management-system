import { Router } from "express";
import {
    assignTripToDriver,
    changeTripStatus,
    getTripsForDriver,
    getTripDetail,
    getAllTrips,
    getTripsRange,
    createTrip,
    deleteTrip,
    getAssignmentGrid,
} from "../controllers/trip-controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getAllTrips);
router.post("/trips_date_range", authenticate, getTripsRange);
router.post("/", authenticate, createTrip);
router.post("/assign", authenticate, assignTripToDriver);
router.patch("/:id/status", authenticate, changeTripStatus);
router.get("/driver/:driverId", authenticate, getTripsForDriver);
router.get("/assignment-grid", authenticate, getAssignmentGrid);
router.get("/:id", authenticate, getTripDetail);
router.delete("/:id", authenticate, deleteTrip);

export default router;
