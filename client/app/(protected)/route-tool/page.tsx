"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Stop,
    RouteSegment,
    RoutePlan,
    SuggestedRoute,
} from "@/lib/routing/types";
import { DEFAULT_STOPS } from "@/lib/routing/mockData";
import { fetchRoute } from "@/lib/routing/routingService";
import {
    saveRoute,
    loadSavedRoutes,
    isRouteNameTaken,
} from "@/lib/routing/storageHelper";
import { createRoute } from "@/lib/api/routes";
import { recommendVehicle } from "@/lib/routing/vehicleLogic";
import RouteMap from "@/components/routing/RouteMap";
import RouteToolbar from "@/components/routing/RouteToolbar";
import RouteOrderingPanel from "@/components/routing/RouteOrderingPanel";
import SuggestRoutesModal from "@/components/routing/SuggestRoutesModal";
import SaveRouteModal from "@/components/routing/SaveRouteModal";
import Toast from "@/components/routing/Toast";

function generateRouteId(): string {
    return `route-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function RoutingTool() {
    // Route state
    const [stops, setStops] = useState<Stop[]>(DEFAULT_STOPS);
    const [segments, setSegments] = useState<RouteSegment[]>([]);
    const [polyline, setPolyline] = useState<[number, number][]>([]);
    const [totalDistanceKm, setTotalDistanceKm] = useState(0);
    const [totalDurationMinutes, setTotalDurationMinutes] = useState(0);

    // UI state
    const [previewStop, setPreviewStop] = useState<Stop | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [routeError, setRouteError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const routeIdRef = useRef(generateRouteId());
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadRoute = useCallback(async (currentStops: Stop[]) => {
        if (currentStops.length < 2) {
            setPolyline([]);
            setSegments([]);
            setTotalDistanceKm(0);
            setTotalDurationMinutes(0);
            setRouteError(null);
            return;
        }
        setIsLoadingRoute(true);
        setRouteError(null);
        try {
            const result = await fetchRoute(currentStops);
            setSegments(result.segments);
            setPolyline(result.polyline);
            setTotalDistanceKm(result.totalDistanceKm);
            setTotalDurationMinutes(result.totalDurationMinutes);
        } catch (err) {
            console.error("[RoutingTool] fetchRoute error:", err);
            setRouteError("Could not reach the routing service.");
            setPolyline([]);
            setSegments([]);
        } finally {
            setIsLoadingRoute(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => loadRoute(stops), 650);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [stops, loadRoute]);

    function handleReorder(newStops: Stop[]) {
        setStops(newStops);
    }

    function handleRemoveStop(id: string) {
        setStops((prev) => prev.filter((s) => s.id !== id));
    }

    function handleAddStop(stop: Stop) {
        setStops((prev) => {
            if (prev.length < 2) return [...prev, stop];
            return [...prev.slice(0, -1), stop, prev[prev.length - 1]];
        });
    }

    function handleApplySuggested(route: SuggestedRoute) {
        setStops(route.stops);
        setIsEditMode(false);
    }

    async function handleConfirmSave(name: string) {
        // Guard against a name added in another tab between opening and saving.
        if (isRouteNameTaken(name, routeIdRef.current)) return;

        const vehicleType = recommendVehicle(stops.length);
        const plan: RoutePlan = {
            id_: routeIdRef.current,
            name,
            stops,
            segments,
            totalDistanceKm,
            totalDurationMinutes,
            vehicleType,
            assignedWeek: "",
            createdAt: new Date().toISOString(),
        };
        saveRoute(plan);
        // Fresh id so the next save creates a new record instead of overwriting.
        routeIdRef.current = generateRouteId();
        setIsSaveOpen(false);

        try {
            const res = await createRoute(plan);
            if (res.success) {
                setToast("Route saved successfully.");
            } else {
                setToast(res.message || "Failed to save route.");
            }
        } catch {
            setToast("Failed to save route to server. Saved locally.");
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div
                style={{
                    position: "relative",
                    zIndex: 0,
                    margin: "-1.75rem -2rem -2rem -2rem",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    background: "var(--background)",
                }}
            >
                <RouteToolbar
                    isEditMode={isEditMode}
                    onToggleEdit={() => {
                        setIsEditMode((v) => !v);
                        setPreviewStop(null);
                    }}
                    onSuggestRoutes={() => setIsSuggestOpen(true)}
                    onSave={() => setIsSaveOpen(true)}
                />

                <div
                    style={{
                        flex: 1,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <RouteMap
                        stops={stops}
                        polyline={polyline}
                        previewStop={previewStop}
                    />

                    <RouteOrderingPanel
                        stops={stops}
                        segments={segments}
                        totalDistanceKm={totalDistanceKm}
                        totalDurationMinutes={totalDurationMinutes}
                        isEditMode={isEditMode}
                        isLoading={isLoadingRoute}
                        routeError={routeError}
                        onReorder={handleReorder}
                        onRemoveStop={handleRemoveStop}
                        onAddStop={handleAddStop}
                        onPreview={setPreviewStop}
                    />
                </div>
            </div>
            {isSuggestOpen && (
                <SuggestRoutesModal
                    onClose={() => setIsSuggestOpen(false)}
                    onApply={handleApplySuggested}
                    currentStops={stops}
                />
            )}

            {isSaveOpen && (
                <SaveRouteModal
                    onClose={() => setIsSaveOpen(false)}
                    onSave={handleConfirmSave}
                    existingNames={loadSavedRoutes().map((r) => r.name)}
                />
            )}

            {toast && (
                <Toast message={toast} onDismiss={() => setToast(null)} />
            )}
        </div>
    );
}
