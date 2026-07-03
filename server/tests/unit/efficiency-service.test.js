// composite efficiency score = 0.5 * delivery success % + 0.5 * fuel ratio % (capped at 100)
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/lib/prisma.js", () => ({
    default: {
        fuel_log: { aggregate: vi.fn() },
    },
}));
vi.mock("../../src/services/order-service.js", () => ({
    getOrdersRange: vi.fn(),
}));
vi.mock("../../src/services/fuel-log-service.js", () => ({
    getLogsRange: vi.fn(),
}));

import prisma from "../../src/lib/prisma.js";
import * as orderService from "../../src/services/order-service.js";
import * as fuelLogService from "../../src/services/fuel-log-service.js";
import { calculateEfficiency } from "../../src/services/efficiency-service.js";

beforeEach(() => {
    vi.resetAllMocks();
    prisma.fuel_log.aggregate.mockResolvedValue({
        _avg: { fuel_efficiency: 10 },
    });
});

describe("calculateEfficiency", () => {
    it("returns 0 when there are no orders and no fuel logs", async () => {
        orderService.getOrdersRange.mockResolvedValue([]);
        fuelLogService.getLogsRange.mockResolvedValue([]);

        expect(await calculateEfficiency()).toBe(0);
    });

    it("returns 50 for perfect deliveries but no fuel data", async () => {
        orderService.getOrdersRange.mockResolvedValue([
            { status: "COMPLETED" },
            { status: "COMPLETED" },
        ]);
        fuelLogService.getLogsRange.mockResolvedValue([]);

        // 100% delivery success * 0.5 + 0% fuel * 0.5
        expect(await calculateEfficiency()).toBe(50);
    });

    it("weights partial delivery success and fuel ratio equally", async () => {
        orderService.getOrdersRange.mockResolvedValue([
            { status: "COMPLETED" },
            { status: "COMPLETED" },
            { status: "PENDING" },
            { status: "FAILED" },
        ]);
        // 50 km / 10 L = 5 km/L actual vs baseline 10 → 50% fuel ratio
        fuelLogService.getLogsRange.mockResolvedValue([
            { distance_traveled: 50, liters_added: 10 },
        ]);

        // 50% success * 0.5 + 50% fuel * 0.5 = 50
        expect(await calculateEfficiency()).toBe(50);
    });

    it("caps the fuel efficiency ratio at 100%", async () => {
        orderService.getOrdersRange.mockResolvedValue([
            { status: "COMPLETED" },
        ]);
        // 300 km / 10 L = 30 km/L, triple the baseline — must cap at 100
        fuelLogService.getLogsRange.mockResolvedValue([
            { distance_traveled: 300, liters_added: 10 },
        ]);

        expect(await calculateEfficiency()).toBe(100);
    });

    it("falls back to a baseline of 10 km/L when there is no history", async () => {
        prisma.fuel_log.aggregate.mockResolvedValue({
            _avg: { fuel_efficiency: null },
        });
        orderService.getOrdersRange.mockResolvedValue([]);
        // 50 km / 10 L = 5 km/L vs fallback baseline 10 → 50% fuel ratio
        fuelLogService.getLogsRange.mockResolvedValue([
            { distance_traveled: 50, liters_added: 10 },
        ]);

        // 0% success * 0.5 + 50% fuel * 0.5 = 25
        expect(await calculateEfficiency()).toBe(25);
    });

    it("rounds the composite score to two decimals", async () => {
        orderService.getOrdersRange.mockResolvedValue([
            { status: "COMPLETED" },
            { status: "PENDING" },
            { status: "PENDING" },
        ]);
        fuelLogService.getLogsRange.mockResolvedValue([]);

        // (1/3 * 100) * 0.5 = 16.666… → 16.67
        expect(await calculateEfficiency()).toBe(16.67);
    });

    it("guards against zero liters without dividing by zero", async () => {
        orderService.getOrdersRange.mockResolvedValue([]);
        fuelLogService.getLogsRange.mockResolvedValue([
            { distance_traveled: 100, liters_added: 0 },
        ]);

        expect(await calculateEfficiency()).toBe(0);
    });
});
