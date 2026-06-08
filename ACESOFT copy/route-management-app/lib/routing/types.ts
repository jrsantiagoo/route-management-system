export type VehicleType = 'car' | 'motorcycle';

export interface Stop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface RouteSegment {
  fromId: string;
  toId: string;
  distanceKm: number;
  durationMinutes: number;
}

export interface RoutePlan {
  id: string;
  name: string;
  stops: Stop[];
  segments: RouteSegment[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  vehicleType: VehicleType;
  assignedWeek: string; // ISO Monday date string – set by the Assignment page
  createdAt: string;    // ISO datetime string
}

export interface SuggestedRoute {
  id: string;
  name: string;
  stops: Stop[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  vehicleType: VehicleType;
  optimizationType: 'fastest' | 'shortest';
  trafficAware: boolean;
  description?: string;
}

export interface WeeklyVehicleAvailability {
  week: string;       // ISO Monday date string
  motorcycles: number;
  cars: number;
}
