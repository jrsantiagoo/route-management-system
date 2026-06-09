// tripController.js

import * as tripService from "../services/trip-service.js";

// --- TRIP ASSIGNMENT ---
export async function assignTripToDriver(req, res) {
  try {
    const { tripId, driverId } = req.body;
    if (!tripId || !driverId) {
      return res.status(400).json({ message: "tripId and driverId are required" });
    }

    const result = await tripService.assignDriverToTrip(tripId, driverId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// --- TRIP STATUS CHANGE --- 
export async function changeTripStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const trip = await tripService.updateTripStatus(id, status);
    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// --- GET TRIPS BY DRIVER ---
export async function getTripsForDriver(req, res) {
  try {
    const { driverId } = req.params;
    const trips = await tripService.getTripsByDriver(driverId);
    res.json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// --- GET TRIP DETAILS --- 
export async function getTripDetail(req, res) {
  try {
    const { id } = req.params;
    const trip = await tripService.getTripById(id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
