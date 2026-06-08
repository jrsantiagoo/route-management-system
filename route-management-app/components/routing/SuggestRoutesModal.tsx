"use client";
import { useState } from "react";
import { SuggestedRoute, Stop } from "@/lib/routing/types";
import { MOCK_WEEKLY_AVAILABILITY } from "@/lib/routing/mockData";
import {
    generateSuggestedRoutes,
    getAvailabilityForWeek,
} from "@/lib/routing/vehicleLogic";
import {
    formatDistance,
    formatDuration,
    formatWeek,
} from "@/lib/routing/formatters";

interface SuggestRoutesModalProps {
    onClose: () => void;
    onApply: (route: SuggestedRoute) => void;
    currentStops: Stop[];
}

export default function SuggestRoutesModal({
    onClose,
    onApply,
    currentStops,
}: SuggestRoutesModalProps) {
    const [selectedWeek, setSelectedWeek] = useState(
        MOCK_WEEKLY_AVAILABILITY[0].week,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestedRoute[]>([]);
    const [hasGenerated, setHasGenerated] = useState(false);

    const availability = getAvailabilityForWeek(selectedWeek);

    async function handleGenerate() {
        setIsLoading(true);
        setSuggestions([]);
        const results = await generateSuggestedRoutes(
            selectedWeek,
            currentStops,
        );
        setSuggestions(results);
        setIsLoading(false);
        setHasGenerated(true);
    }

    function handleWeekChange(week: string) {
        setSelectedWeek(week);
        setHasGenerated(false);
        setSuggestions([]);
    }

    return (
        /* Backdrop */
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99998,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.4)",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Dialog */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: "8px",
                    width: "520px",
                    maxWidth: "92vw",
                    maxHeight: "88vh",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "16px 20px",
                        borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "16px",
                                fontWeight: 700,
                                color: "#111827",
                            }}
                        >
                            Suggest Routes
                        </h2>
                        <p
                            style={{
                                margin: "3px 0 0",
                                fontSize: "12px",
                                color: "#6b7280",
                            }}
                        >
                            Automated delivery route planning
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#6b7280",
                            lineHeight: 1,
                            padding: "0 4px",
                        }}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Controls */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "flex-end",
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#374151",
                                    marginBottom: "6px",
                                }}
                            >
                                Delivery Week
                            </label>
                            <select
                                value={selectedWeek}
                                onChange={(e) =>
                                    handleWeekChange(e.target.value)
                                }
                                style={{
                                    width: "100%",
                                    padding: "8px 10px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    fontSize: "13px",
                                    color: "#111827",
                                    background: "#fff",
                                }}
                            >
                                {MOCK_WEEKLY_AVAILABILITY.map((w) => (
                                    <option key={w.week} value={w.week}>
                                        {formatWeek(w.week)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            style={{
                                padding: "8px 22px",
                                background: isLoading ? "#9ca3af" : "#374151",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "13px",
                                fontWeight: 500,
                                cursor: isLoading ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}
                        >
                            {isLoading ? "Generating…" : "Generate"}
                        </button>
                    </div>

                    {/* Vehicle availability summary */}
                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            marginTop: "10px",
                            fontSize: "12px",
                        }}
                    >
                        <span style={{ color: "#6b7280" }}>
                            Fleet this week:
                        </span>
                        <span style={{ color: "#374151" }}>
                            <strong>{availability.cars}</strong> car
                            {availability.cars !== 1 ? "s" : ""}
                        </span>
                        <span style={{ color: "#374151" }}>
                            <strong>{availability.motorcycles}</strong>{" "}
                            motorcycle
                            {availability.motorcycles !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {/* Results area */}
                <div
                    style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}
                >
                    {/* Loading */}
                    {isLoading && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "48px 0",
                                color: "#6b7280",
                                fontSize: "13px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "28px",
                                    marginBottom: "10px",
                                    animation: "spin 1s linear infinite",
                                }}
                            >
                                ⟳
                            </div>
                            <div>Generating route suggestions…</div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    marginTop: "4px",
                                }}
                            >
                                Computing routes for your stops via OSRM
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && hasGenerated && suggestions.length === 0 && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "48px 0",
                                color: "#9ca3af",
                                fontSize: "13px",
                            }}
                        >
                            No routes available for this week&apos;s vehicle
                            configuration.
                        </div>
                    )}

                    {/* Prompt */}
                    {!isLoading && !hasGenerated && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "48px 0",
                                color: "#9ca3af",
                                fontSize: "13px",
                            }}
                        >
                            Select a delivery week and click{" "}
                            <strong style={{ color: "#6b7280" }}>
                                Generate
                            </strong>{" "}
                            to see suggested routes.
                        </div>
                    )}

                    {/* Route cards */}
                    {!isLoading &&
                        suggestions.map((route) => {
                            const isMoto = route.vehicleType === "motorcycle";
                            return (
                                <div
                                    key={route.id}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "6px",
                                        padding: "14px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {/* Card header */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 700,
                                                    color: "#111827",
                                                }}
                                            >
                                                {route.name}
                                            </div>
                                            {route.description && (
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#6b7280",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    {route.description}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                onApply(route);
                                                onClose();
                                            }}
                                            style={{
                                                padding: "5px 16px",
                                                background: "#374151",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                flexShrink: 0,
                                                marginLeft: "12px",
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {/* Badges */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "6px",
                                            flexWrap: "wrap",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                padding: "2px 8px",
                                                borderRadius: "12px",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                background: isMoto
                                                    ? "#fef9c3"
                                                    : "#dbeafe",
                                                color: isMoto
                                                    ? "#a16207"
                                                    : "#1d4ed8",
                                                border: `1px solid ${isMoto ? "#fde68a" : "#bfdbfe"}`,
                                            }}
                                        >
                                            {isMoto
                                                ? "🏍️ Motorcycle"
                                                : "🚗 Car"}
                                        </span>
                                        <span
                                            style={{
                                                padding: "2px 8px",
                                                borderRadius: "12px",
                                                fontSize: "11px",
                                                background:
                                                    route.optimizationType ===
                                                    "fastest"
                                                        ? "#dcfce7"
                                                        : "#f3f4f6",
                                                color:
                                                    route.optimizationType ===
                                                    "fastest"
                                                        ? "#166534"
                                                        : "#374151",
                                            }}
                                        >
                                            {route.optimizationType ===
                                            "fastest"
                                                ? "⚡ Fastest"
                                                : "📏 Shortest"}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            fontSize: "12px",
                                            color: "#6b7280",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span>
                                            {formatDistance(
                                                route.totalDistanceKm,
                                            )}
                                        </span>
                                        <span>·</span>
                                        <span>
                                            {formatDuration(
                                                route.totalDurationMinutes,
                                            )}
                                        </span>
                                        <span>·</span>
                                        <span>{route.stops.length} stops</span>
                                    </div>

                                    {/* Stop list preview */}
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#374151",
                                        }}
                                    >
                                        {route.stops.map((stop, i) => (
                                            <div
                                                key={stop.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "2px 0",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "16px",
                                                        height: "16px",
                                                        borderRadius: "50%",
                                                        flexShrink: 0,
                                                        background:
                                                            i === 0
                                                                ? "#22c55e"
                                                                : i ===
                                                                    route.stops
                                                                        .length -
                                                                        1
                                                                  ? "#ef4444"
                                                                  : "#3b82f6",
                                                        color: "#fff",
                                                        fontSize: "9px",
                                                        fontWeight: 700,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    {i === 0
                                                        ? "S"
                                                        : i ===
                                                            route.stops.length -
                                                                1
                                                          ? "E"
                                                          : i}
                                                </div>
                                                <span>{stop.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Footer note */}
                <div
                    style={{
                        padding: "10px 20px",
                        borderTop: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        borderRadius: "0 0 8px 8px",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "#9ca3af",
                            lineHeight: 1.5,
                        }}
                    >
                        Traffic-aware routing is planned for a future release
                        (Mapbox / HERE API). Vehicle rules: motorcycles ≤ 3
                        stops · cars ≥ 4 stops.
                    </p>
                </div>
            </div>
        </div>
    );
}
