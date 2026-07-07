// /api/efficiency through the real Express app, Prisma mocked
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/lib/prisma.js", () => ({
    default: {
        order: { findMany: vi.fn() },
        fuel_log: { findMany: vi.fn(), aggregate: vi.fn() },
    },
}));

import prisma from "../../src/lib/prisma.js";
import app from "../../src/app.js";

beforeEach(() => {
    vi.resetAllMocks();
});

describe("POST /api/efficiency", () => {
    it("returns 0 when there is no data in range", async () => {
        prisma.order.findMany.mockResolvedValue([]);
        prisma.fuel_log.findMany.mockResolvedValue([]);

        const res = await request(app)
            .post("/api/efficiency")
            .send({ startDate: "2026-07-01", endDate: "2026-07-06" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, data: 0 });
    });

    it("combines delivery success and fuel ratio through the full stack", async () => {
        // 1 of 2 orders completed (50% delivery) and fuel exactly at baseline (100%)
        prisma.order.findMany.mockResolvedValue([
            { status: "COMPLETED" },
            { status: "PENDING" },
        ]);
        prisma.fuel_log.findMany.mockResolvedValue([
            { distance_traveled: 100, liters_added: 10 },
        ]);
        prisma.fuel_log.aggregate.mockResolvedValue({
            _avg: { fuel_efficiency: 10 },
        });

        const res = await request(app)
            .post("/api/efficiency")
            .send({ startDate: "2026-07-01", endDate: "2026-07-06" });

        expect(res.status).toBe(200);
        // 50 * 0.5 + 100 * 0.5
        expect(res.body.data).toBe(75);
    });
});
