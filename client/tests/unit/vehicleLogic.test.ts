// vehicle recommendation + suggested-route generation, OSRM mocked
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/routing/routingService", () => ({
    fetchRoute: vi.fn(),
}));

import { fetchRoute } from "../../lib/routing/routingService";
import {
    recommendVehicle,
    getAvailabilityForWeek,
    generateSuggestedRoutes,
} from "../../lib/routing/vehicleLogic";
import type { Stop } from "../../lib/routing/types";

const stop = (id: string, lat: number, lng: number): Stop => ({
    id,
    name: id,
    address: id,
    lat,
    lng,
});

const OSRM_RESULT = {
    segments: [],
    polyline: [] as [number, number][],
    totalDistanceKm: 10,
    totalDurationMinutes: 20,
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("recommendVehicle", () => {
    it("recommends a motorcycle for up to 3 stops and a car beyond", () => {
        expect(recommendVehicle(3)).toBe("motorcycle");
        expect(recommendVehicle(4)).toBe("car");
    });
});

describe("getAvailabilityForWeek", () => {
    it("falls back to a default fleet for an unknown week", () => {
        expect(getAvailabilityForWeek("2099-01-04")).toEqual({
            week: "2099-01-04",
            motorcycles: 1,
            cars: 2,
        });
    });
});

describe("generateSuggestedRoutes", () => {
    it("returns nothing with fewer than 2 stops", async () => {
        const routes = await generateSuggestedRoutes("2099-01-04", [
            stop("a", 14.5, 121.0),
        ]);

        expect(routes).toEqual([]);
        expect(fetchRoute).not.toHaveBeenCalled();
    });

    it("offers car and motorcycle variants for a 2-stop route", async () => {
        vi.mocked(fetchRoute).mockResolvedValue(OSRM_RESULT);

        const routes = await generateSuggestedRoutes("2099-01-04", [
            stop("a", 14.5, 121.0),
            stop("b", 14.6, 121.1),
        ]);

        expect(routes.map((r) => r.name)).toEqual([
            "Route A – Fastest",
            "Route C – Motorcycle Express",
        ]);
        expect(routes[0].totalDistanceKm).toBe(10);
    });

    it("caps the motorcycle variant at 3 stops", async () => {
        vi.mocked(fetchRoute).mockResolvedValue(OSRM_RESULT);

        const routes = await generateSuggestedRoutes("2099-01-04", [
            stop("a", 14.5, 121.0),
            stop("b", 14.6, 121.1),
            stop("c", 14.7, 121.2),
            stop("d", 14.8, 121.3),
            stop("e", 14.9, 121.4),
        ]);

        const moto = routes.find((r) => r.vehicleType === "motorcycle");
        expect(moto?.stops).toHaveLength(3);
        // start and end stay fixed
        expect(moto?.stops[0].id).toBe("a");
        expect(moto?.stops[2].id).toBe("e");
    });

    it("drops variants whose OSRM request fails", async () => {
        vi.mocked(fetchRoute)
            .mockResolvedValueOnce(OSRM_RESULT)
            .mockRejectedValueOnce(new Error("OSRM down"));

        const routes = await generateSuggestedRoutes("2099-01-04", [
            stop("a", 14.5, 121.0),
            stop("b", 14.6, 121.1),
        ]);

        expect(routes).toHaveLength(1);
        expect(routes[0].name).toBe("Route A – Fastest");
    });
});
