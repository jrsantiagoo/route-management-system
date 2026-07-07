// dashboard trend line (centered moving average)
import { describe, it, expect } from "vitest";
import { computeTrend } from "../../lib/dashboard/trend-compute";

const data = [
    { day: "Mon", distance: 10 },
    { day: "Tue", distance: 20 },
    { day: "Wed", distance: 30 },
    { day: "Thu", distance: 40 },
];

describe("computeTrend", () => {
    it("averages each point with its neighbors", () => {
        const result = computeTrend(data, "distance");

        // middle points: (10+20+30)/3 and (20+30+40)/3
        expect(result[1].trend).toBe(20);
        expect(result[2].trend).toBe(30);
    });

    it("clamps the window at the edges", () => {
        const result = computeTrend(data, "distance");

        expect(result[0].trend).toBe(15); // (10+20)/2
        expect(result[3].trend).toBe(35); // (30+40)/2
    });

    it("rounds to one decimal and keeps the original fields", () => {
        const result = computeTrend(
            [
                { day: "Mon", distance: 1 },
                { day: "Tue", distance: 2 },
            ],
            "distance",
        );

        expect(result[0]).toEqual({ day: "Mon", distance: 1, trend: 1.5 });
    });
});
