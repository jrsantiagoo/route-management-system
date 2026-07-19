export type VehicleType = "car" | "motorcycle";

export interface Stop {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
}

export interface Driver {
    id_: string;
    driver_id: string;
    name?: string;
    contact_number?: string;
    license_number?: string;
}

export interface RouteSegment {
    fromId: string;
    toId: string;
    distanceKm: number;
    durationMinutes: number;
}

export interface RoutePlan {
    id_: string;
    name: string;
    stops: Stop[];
    segments: RouteSegment[];
    totalDistanceKm: number;
    totalDurationMinutes: number;
    vehicleType: VehicleType;
    assignedWeek: string; // ISO Monday date string – set by the Assignment page
    createdAt: string; // ISO datetime string
}

export interface Trip {
    id_: string;
    status: string;
    tag_type: string;
    scheduled_date: string;
    created_at: string;
    purpose: string;
    destination: string;
    driver_id_?: string;
    route_id_: string;
    route: RoutePlan;
    agent_profile?: Driver;
}

export interface Order {
    id_: string;
    order_id: string;
    client: string;
    destination?: string;
    ordered_on: string;
    delivered_by?: string;
    package_content?: string;
    package_size?: string;
    package_weight?: string;
    status: string;
}

export interface SuggestedRoute {
    id: string;
    name: string;
    stops: Stop[];
    totalDistanceKm: number;
    totalDurationMinutes: number;
    vehicleType: VehicleType;
    optimizationType: "fastest" | "shortest";
    trafficAware: boolean;
    description?: string;

    // Optional historical performance context (mocked – see lib/routing/mockData.ts).
    // These are supporting hints only; the displayed distance/duration above still
    // come from the live OSRM calculation.
    historicalInsight?: string;
    previousAverageDuration?: number; // minutes
    previousAverageDistance?: number; // km
    successfulTripCount?: number;
    historicalPeriod?: string; // e.g. "last week", "two weeks ago", "last month"
}

/**
 * A mocked record of how a route (or a kind of route) has performed in the past.
 * Used to enrich route suggestions with historical insight while there is no
 * backend. Matched either by an exact set of stop ids, or — when `stopIds` is
 * omitted — by the vehicle + optimization "kind" of the suggestion.
 */
export interface HistoricalRoutePerformance {
    id: string;
    label: string;
    /** Sorted stop ids this record describes. Omit for a generic kind-level record. */
    stopIds?: string[];
    vehicleType: VehicleType;
    optimizationType: "fastest" | "shortest";
    averageDistanceKm: number;
    averageDurationMinutes: number;
    successfulTripCount: number;
    lastUsed: string; // ISO date string
    historicalPeriod: string; // e.g. "last week", "two weeks ago", "last month"
}

export interface WeeklyVehicleAvailability {
    week: string; // ISO Monday date string
    motorcycles: number;
    cars: number;
}
