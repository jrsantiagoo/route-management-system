"use client";

import { useState, useRef, useEffect } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import {
    mockRoutes,
    mockDrivers,
    getRouteById,
    getDriverById,
} from "@/lib/assignment/mockData";
import type { MockTrip } from "@/lib/assignment/mockData";
import type { RoutePlan } from "@/lib/routing/types";
import type { Driver } from "@/lib/routing/types";

interface AssignmentFormProps {
    onCreated: (trip: MockTrip) => void;
}

export default function AssignmentForm({ onCreated }: AssignmentFormProps) {
    const [open, setOpen] = useState(false);
    const [routes, setRoutes] = useState<RoutePlan[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [routeId, setRouteId] = useState("");
    const [driverId, setDriverId] = useState("");
    const [date, setDate] = useState(() =>
        new Date().toISOString().slice(0, 10),
    );
    const ref = useRef<HTMLDivElement>(null);

    // Load mock data on mount
    useEffect(() => {
        setRoutes(mockRoutes);
        setDrivers(mockDrivers);
    }, []);

    // Close the panel when clicking outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Build a MockTrip from the selected form values and pass it up
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!routeId || !driverId) return;

        const route = getRouteById(routeId);
        const driver = getDriverById(driverId);
        if (!route || !driver) return;

        const now = new Date();
        const newTrip: MockTrip = {
            id_: `trip-mock-${now.getTime()}`,
            status: "PENDING",
            tag_type: "ASSIGNED",
            scheduled_date: `${date}T08:00:00Z`,
            created_at: now.toISOString(),
            purpose: "General delivery",
            destination: route.name,
            driver_id_: driver.id_,
            route_id_: route.id_,
            route: { id_: route.id_, name: route.name },
            agent_profile: { id_: driver.id_, driver_id: driver.driver_id },
        };

        setOpen(false);
        onCreated(newTrip);
    }

    function handleCancel() {
        setOpen(false);
    }

    return (
        <div ref={ref} className="relative">
            {/* Enables Assignments */}
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center -mt-2 gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg border border-border bg-card 
                    text-foreground hover:bg-secondary dark:hover:text-primary transition duration-300"
            >
                {open ? <CircleMinus size={16} /> : <CirclePlus size={16} />}
                New Assignment
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-2 bg-card border border-border rounded-md shadow-lg p-4 z-30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                        Create Assignment
                    </h4>
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted-foreground">
                                Route
                            </label>
                            <select
                                value={routeId}
                                onChange={(e) => setRouteId(e.target.value)}
                                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                required
                            >
                                <option value="">Select a route</option>
                                {routes.map((r) => (
                                    <option key={r.id_} value={r.id_}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted-foreground">
                                Driver
                            </label>
                            <select
                                value={driverId}
                                onChange={(e) => setDriverId(e.target.value)}
                                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                required
                            >
                                <option value="">Select a driver</option>
                                {drivers.map((d) => (
                                    <option key={d.id_} value={d.id_}>
                                        {d.driver_id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted-foreground">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground dark:scheme-dark"
                                required
                            />
                        </div>

                        <div className="flex font-semibold justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3 py-1 text-sm rounded-md border border-border text-foreground hover:bg-secondary dark:hover:text-primary transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-secondary transition"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
