import prisma from "../lib/prisma.js";

const VALID_STATUSES = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
];

export async function getTripById(tripId) {
  return prisma.trip.findUnique({
    where: { id_: tripId },
    include: {
      agent_profile: true,
      route: true,
    },
  });
}

export async function getTripsByDriver(driverId) {
  return prisma.trip.findMany({
    where: { driver_id_: driverId },
    include: {
      agent_profile: true,
      route: true,
    },
    orderBy: {
      scheduled_date: "asc",
    },
  });
}

export async function assignDriverToTrip(tripId, driverId) {
  const trip = await prisma.trip.findUnique({ where: { id_: tripId } });
  if (!trip) {
    throw new Error("Trip not found");
  }

  const driver = await prisma.agent_profile.findUnique({ where: { id_: driverId } });
  if (!driver) {
    throw new Error("Driver not found");
  }

  if (trip.driver_id_) {
    throw new Error("Trip is already assigned");
  }

  return prisma.trip.update({
    where: { id_: tripId },
    data: {
      driver_id_: driverId,
      tag_type: "ASSIGNED",
    },
    include: {
      agent_profile: true,
      route: true,
    },
  });
}

export async function updateTripStatus(tripId, status) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Valid values are: ${VALID_STATUSES.join(", ")}`);
  }

  const trip = await prisma.trip.findUnique({ where: { id_: tripId } });
  if (!trip) {
    throw new Error("Trip not found");
  }

  return prisma.trip.update({
    where: { id_: tripId },
    data: {
      status,
    },
    include: {
      agent_profile: true,
      route: true,
    },
  });
}
