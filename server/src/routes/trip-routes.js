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

const router = Router();

router.get("/", getAllTrips);
router.post("/trips_date_range", getTripsRange);
router.post("/", createTrip);
router.post("/assign", assignTripToDriver);
router.patch("/:id/status", changeTripStatus);
router.get("/driver/:driverId", getTripsForDriver);
router.get("/assignment-grid", getAssignmentGrid);
router.get("/:id", getTripDetail);
router.delete("/:id", deleteTrip);

export default router;
