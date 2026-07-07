// routing formatters
import { describe, it, expect } from "vitest";
import {
    formatDistance,
    formatDuration,
    formatWeek,
} from "../../lib/routing/formatters";

describe("formatDistance", () => {
    it("shows meters below 1 km", () => {
        expect(formatDistance(0.4)).toBe("400 m");
        expect(formatDistance(0.9996)).toBe("1000 m");
    });

    it("shows one decimal in km from 1 km up", () => {
        expect(formatDistance(1)).toBe("1.0 km");
        expect(formatDistance(12.55)).toBe("12.6 km");
    });
});

describe("formatDuration", () => {
    it("shows minutes below an hour", () => {
        expect(formatDuration(0)).toBe("0 min");
        expect(formatDuration(59.4)).toBe("59 min");
    });

    it("splits into hours and minutes", () => {
        expect(formatDuration(60)).toBe("1h");
        expect(formatDuration(75)).toBe("1h 15min");
        expect(formatDuration(119.6)).toBe("2h");
    });
});

describe("formatWeek", () => {
    it("spans the Monday through the following Sunday", () => {
        const short: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
        };
        const full: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
            year: "numeric",
        };
        const expected = `${new Date(2026, 0, 5).toLocaleDateString("en-PH", short)} – ${new Date(2026, 0, 11).toLocaleDateString("en-PH", full)}`;

        expect(formatWeek("2026-01-05")).toBe(expected);
    });
});
