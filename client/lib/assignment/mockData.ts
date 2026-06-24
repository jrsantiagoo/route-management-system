import type { RoutePlan } from "@/lib/routing/types";
import type { Driver } from "@/lib/routing/types";

// Mock Data for Assignment Page
export const mockRoutes: RoutePlan[] = [
    {
        id_: "route-1",
        id: "route-1",
        name: "Makati Loop",
        stops: [],
        segments: [],
        totalDistanceKm: 12.4,
        totalDurationMinutes: 45,
        vehicleType: "car",
        assignedWeek: "2026-06-22",
        createdAt: "2026-06-01T08:00:00Z",
    },
    {
        id_: "route-2",
        id: "route-2",
        name: "BGC Express",
        stops: [],
        segments: [],
        totalDistanceKm: 8.2,
        totalDurationMinutes: 30,
        vehicleType: "motorcycle",
        assignedWeek: "2026-06-22",
        createdAt: "2026-06-01T08:00:00Z",
    },
    {
        id_: "route-3",
        id: "route-3",
        name: "Ortigas Corridor",
        stops: [],
        segments: [],
        totalDistanceKm: 15.1,
        totalDurationMinutes: 55,
        vehicleType: "car",
        assignedWeek: "2026-06-22",
        createdAt: "2026-06-02T10:00:00Z",
    },
    {
        id_: "route-4",
        id: "route-4",
        name: "Alabang Run",
        stops: [],
        segments: [],
        totalDistanceKm: 22.6,
        totalDurationMinutes: 70,
        vehicleType: "car",
        assignedWeek: "2026-06-22",
        createdAt: "2026-06-02T10:00:00Z",
    },
    {
        id_: "route-5",
        id: "route-5",
        name: "Quezon City East",
        stops: [],
        segments: [],
        totalDistanceKm: 18.3,
        totalDurationMinutes: 60,
        vehicleType: "motorcycle",
        assignedWeek: "2026-06-22",
        createdAt: "2026-06-03T09:00:00Z",
    },
    {
        id_: "route-6",
        id: "route-6",
        name: "Pasay–Taguig Link",
        stops: [],
        segments: [],
        totalDistanceKm: 10.7,
        totalDurationMinutes: 35,
        vehicleType: "motorcycle",
        assignedWeek: "2026-06-22",
        createdAt: "2026-06-03T09:00:00Z",
    },
];

// Placeholder Driver Data
export const mockDrivers: Driver[] = [
    { id_: "driver-1", driver_id: "DRV001", contact_number: "09171234567" },
    { id_: "driver-2", driver_id: "DRV002", contact_number: "09172345678" },
    { id_: "driver-3", driver_id: "DRV003", contact_number: "09173456789" },
    { id_: "driver-4", driver_id: "DRV004", contact_number: "09174567890" },
    { id_: "driver-5", driver_id: "DRV005", contact_number: "09175678901" },
    { id_: "driver-6", driver_id: "DRV006", contact_number: "09176789012" },
    { id_: "driver-7", driver_id: "DRV007", contact_number: "09177890123" },
    { id_: "driver-8", driver_id: "DRV008", contact_number: "09178901234" },
    { id_: "driver-9", driver_id: "DRV009", contact_number: "09179012345" },
    { id_: "driver-10", driver_id: "DRV010", contact_number: "09170123456" },
    { id_: "driver-11", driver_id: "DRV011", contact_number: "09181234567" },
    { id_: "driver-12", driver_id: "DRV012", contact_number: "09182345678" },
    { id_: "driver-13", driver_id: "DRV013", contact_number: "09183456789" },
    { id_: "driver-14", driver_id: "DRV014", contact_number: "09184567890" },
    { id_: "driver-15", driver_id: "DRV015", contact_number: "09185678901" },
];

// Mock trip interface matching the shape the table and calendar expect
export interface MockTrip {
    id_: string;
    status: string;
    tag_type: string;
    scheduled_date: string;
    created_at: string;
    purpose: string;
    destination: string;
    driver_id_: string;
    route_id_: string;
    route: { id_: string; name: string };
    agent_profile: { id_: string; driver_id: string };
}

// Mock trips spread across the current week (Mon Jun 22 – Sun Jun 28, 2026)
// with varied statuses, drivers, and routes so both views render data.
export const mockTrips: MockTrip[] = [
    // --- Monday June 22 ---
    {
        id_: "trip-01",
        status: "COMPLETED",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-22T08:00:00Z",
        created_at: "2026-06-20T10:00:00Z",
        purpose: "General Delivery",
        destination: "Makati City",
        driver_id_: "driver-1",
        route_id_: "route-1",
        route: { id_: "route-1", name: "Makati Loop" },
        agent_profile: { id_: "driver-1", driver_id: "DRV001" },
    },
    {
        id_: "trip-02",
        status: "COMPLETED",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-22T09:00:00Z",
        created_at: "2026-06-20T10:00:00Z",
        purpose: "General Delivery",
        destination: "Taguig City",
        driver_id_: "driver-2",
        route_id_: "route-2",
        route: { id_: "route-2", name: "BGC Express" },
        agent_profile: { id_: "driver-2", driver_id: "DRV002" },
    },

    // --- Tuesday June 23 ---
    {
        id_: "trip-03",
        status: "COMPLETED",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-23T08:00:00Z",
        created_at: "2026-06-20T10:00:00Z",
        purpose: "General Delivery",
        destination: "Pasig City",
        driver_id_: "driver-1",
        route_id_: "route-3",
        route: { id_: "route-3", name: "Ortigas Corridor" },
        agent_profile: { id_: "driver-1", driver_id: "DRV001" },
    },
    {
        id_: "trip-04",
        status: "COMPLETED",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-23T08:30:00Z",
        created_at: "2026-06-20T10:00:00Z",
        purpose: "General Delivery",
        destination: "Muntinlupa City",
        driver_id_: "driver-3",
        route_id_: "route-4",
        route: { id_: "route-4", name: "Alabang Run" },
        agent_profile: { id_: "driver-3", driver_id: "DRV003" },
    },
    {
        id_: "trip-05",
        status: "COMPLETED",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-23T09:00:00Z",
        created_at: "2026-06-20T10:00:00Z",
        purpose: "General Delivery",
        destination: "Quezon City",
        driver_id_: "driver-4",
        route_id_: "route-5",
        route: { id_: "route-5", name: "Quezon City East" },
        agent_profile: { id_: "driver-4", driver_id: "DRV004" },
    },

    // --- Wednesday June 24 (today) ---
    {
        id_: "trip-06",
        status: "PROCESSING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-24T08:00:00Z",
        created_at: "2026-06-21T10:00:00Z",
        purpose: "General Delivery",
        destination: "Makati City",
        driver_id_: "driver-1",
        route_id_: "route-1",
        route: { id_: "route-1", name: "Makati Loop" },
        agent_profile: { id_: "driver-1", driver_id: "DRV001" },
    },
    {
        id_: "trip-07",
        status: "PROCESSING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-24T08:30:00Z",
        created_at: "2026-06-21T10:00:00Z",
        purpose: "General Delivery",
        destination: "Pasay City",
        driver_id_: "driver-2",
        route_id_: "route-6",
        route: { id_: "route-6", name: "Pasay–Taguig Link" },
        agent_profile: { id_: "driver-2", driver_id: "DRV002" },
    },
    {
        id_: "trip-08",
        status: "PENDING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-24T09:00:00Z",
        created_at: "2026-06-21T10:00:00Z",
        purpose: "General Delivery",
        destination: "Taguig City",
        driver_id_: "driver-3",
        route_id_: "route-2",
        route: { id_: "route-2", name: "BGC Express" },
        agent_profile: { id_: "driver-3", driver_id: "DRV003" },
    },

    // --- Thursday June 25 ---
    {
        id_: "trip-09",
        status: "PENDING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-25T08:00:00Z",
        created_at: "2026-06-22T10:00:00Z",
        purpose: "General Delivery",
        destination: "Makati City",
        driver_id_: "driver-2",
        route_id_: "route-1",
        route: { id_: "route-1", name: "Makati Loop" },
        agent_profile: { id_: "driver-2", driver_id: "DRV002" },
    },
    {
        id_: "trip-10",
        status: "PENDING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-25T08:30:00Z",
        created_at: "2026-06-22T10:00:00Z",
        purpose: "General Delivery",
        destination: "Pasig City",
        driver_id_: "driver-4",
        route_id_: "route-3",
        route: { id_: "route-3", name: "Ortigas Corridor" },
        agent_profile: { id_: "driver-4", driver_id: "DRV004" },
    },
    {
        id_: "trip-11",
        status: "PENDING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-25T09:00:00Z",
        created_at: "2026-06-22T10:00:00Z",
        purpose: "General Delivery",
        destination: "Quezon City",
        driver_id_: "driver-5",
        route_id_: "route-5",
        route: { id_: "route-5", name: "Quezon City East" },
        agent_profile: { id_: "driver-5", driver_id: "DRV005" },
    },

    // --- Friday June 26 ---
    {
        id_: "trip-12",
        status: "PENDING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-26T08:00:00Z",
        created_at: "2026-06-23T10:00:00Z",
        purpose: "General Delivery",
        destination: "Muntinlupa City",
        driver_id_: "driver-1",
        route_id_: "route-4",
        route: { id_: "route-4", name: "Alabang Run" },
        agent_profile: { id_: "driver-1", driver_id: "DRV001" },
    },
    {
        id_: "trip-13",
        status: "PENDING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-26T08:30:00Z",
        created_at: "2026-06-23T10:00:00Z",
        purpose: "General Delivery",
        destination: "Quezon City",
        driver_id_: "driver-3",
        route_id_: "route-5",
        route: { id_: "route-5", name: "Quezon City East" },
        agent_profile: { id_: "driver-3", driver_id: "DRV003" },
    },
    {
        id_: "trip-14",
        status: "PENDING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-26T09:00:00Z",
        created_at: "2026-06-23T10:00:00Z",
        purpose: "General Delivery",
        destination: "Pasay City",
        driver_id_: "driver-6",
        route_id_: "route-6",
        route: { id_: "route-6", name: "Pasay–Taguig Link" },
        agent_profile: { id_: "driver-6", driver_id: "DRV006" },
    },

    // --- Saturday June 27 ---
    {
        id_: "trip-15",
        status: "PENDING",
        tag_type: "ASSIGNED",
        scheduled_date: "2026-06-27T08:00:00Z",
        created_at: "2026-06-24T10:00:00Z",
        purpose: "General Delivery",
        destination: "Pasig City",
        driver_id_: "driver-2",
        route_id_: "route-3",
        route: { id_: "route-3", name: "Ortigas Corridor" },
        agent_profile: { id_: "driver-2", driver_id: "DRV002" },
    },
];

// Look-up helpers used by the assignment form
export function getRouteById(id: string) {
    return mockRoutes.find((r) => r.id_ === id);
}

export function getDriverById(id: string) {
    return mockDrivers.find((d) => d.id_ === id);
}
