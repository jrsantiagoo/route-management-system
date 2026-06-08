import {
    VehicleType,
    SuggestedRoute,
    WeeklyVehicleAvailability,
    Stop,
} from "./types";
import { MOCK_WEEKLY_AVAILABILITY } from "./mockData";
import { fetchRoute } from "./routingService";

export function recommendVehicle(totalStopCount: number): VehicleType {
    return totalStopCount <= 3 ? "motorcycle" : "car";
}

export function getAvailabilityForWeek(
    week: string,
): WeeklyVehicleAvailability {
    return (
        MOCK_WEEKLY_AVAILABILITY.find((w) => w.week === week) ?? {
            week,
            motorcycles: 1,
            cars: 2,
        }
    );
}

// Reorders middle stops using nearest-neighbor heuristic; start and end stay fixed.
function nearestNeighborOrder(stops: Stop[]): Stop[] {
    if (stops.length <= 3) return stops;
    const start = stops[0];
    const end = stops[stops.length - 1];
    const remaining = stops.slice(1, -1);
    const ordered: Stop[] = [];
    let current = start;
    while (remaining.length > 0) {
        let nearestIdx = 0;
        let minDist = Infinity;
        for (let i = 0; i < remaining.length; i++) {
            const dx = remaining[i].lng - current.lng;
            const dy = remaining[i].lat - current.lat;
            const d = dx * dx + dy * dy;
            if (d < minDist) {
                minDist = d;
                nearestIdx = i;
            }
        }
        current = remaining[nearestIdx];
        ordered.push(remaining.splice(nearestIdx, 1)[0]);
    }
    return [start, ...ordered, end];
}

export async function generateSuggestedRoutes(
    week: string,
    currentStops: Stop[],
): Promise<SuggestedRoute[]> {
    if (currentStops.length < 2) return [];

    const availability = getAvailabilityForWeek(week);

    type Variant = {
        stops: Stop[];
        vehicleType: VehicleType;
        optimizationType: "fastest" | "shortest";
        name: string;
        description: string;
    };

    const variants: Variant[] = [];

    if (availability.cars > 0) {
        variants.push({
            stops: currentStops,
            vehicleType: "car",
            optimizationType: "fastest",
            name: "Route A – Fastest",
            description: `Optimized for travel time. ${currentStops.length} stops.`,
        });

        const reordered = nearestNeighborOrder(currentStops);
        const isDifferentOrder = reordered.some(
            (s, i) => s.id !== currentStops[i].id,
        );
        if (isDifferentOrder) {
            variants.push({
                stops: reordered,
                vehicleType: "car",
                optimizationType: "shortest",
                name: "Route B – Shortest Distance",
                description: `Minimizes total kilometers driven. ${reordered.length} stops.`,
            });
        }
    }

    if (availability.motorcycles > 0) {
        const start = currentStops[0];
        const end = currentStops[currentStops.length - 1];
        const middle = currentStops.slice(1, -1);
        // Motorcycle handles at most 1 middle stop (≤ 3 stops total)
        const motoStops =
            middle.length > 0 ? [start, middle[0], end] : [start, end];
        variants.push({
            stops: motoStops,
            vehicleType: "motorcycle",
            optimizationType: "fastest",
            name: "Route C – Motorcycle Express",
            description:
                middle.length > 0
                    ? `${motoStops.length}-stop express route for a motorcycle.`
                    : `Direct route for a motorcycle.`,
        });
    }

    const results = await Promise.allSettled(
        variants.map((v) => fetchRoute(v.stops)),
    );

    return results.flatMap((result, i) => {
        if (result.status !== "fulfilled") return [];
        return [
            {
                id: `sr-dyn-${i}-${Date.now()}`,
                name: variants[i].name,
                stops: variants[i].stops,
                totalDistanceKm: result.value.totalDistanceKm,
                totalDurationMinutes: result.value.totalDurationMinutes,
                vehicleType: variants[i].vehicleType,
                optimizationType: variants[i].optimizationType,
                trafficAware: false,
                description: variants[i].description,
            },
        ] satisfies SuggestedRoute[];
    });
}
