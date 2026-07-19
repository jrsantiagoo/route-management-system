"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarDays, List, User } from "lucide-react";
import type { Trip, Driver, RoutePlan } from "@/lib/routing/types";
import { getAllTrips, createTrip, deleteTrip } from "@/lib/api/trips";
import { getDrivers } from "@/lib/api/drivers";
import { getRoutes } from "@/lib/api/routes";

import AssignmentForm from "@/components/assignment/assignment-form";
import CalendarView from "@/components/assignment/calendar-view";
import TableView from "@/components/assignment/table-view";
import DriverView from "@/components/assignment/driver-view";
import { mockDriverDayData } from "@/lib/assignment/mockData";

export default function Assignment() {
    const [viewMode, setViewMode] = useState<"calendar" | "table" | "driver">(
        "calendar",
    );
    const [trips, setTrips] = useState<Trip[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [routes, setRoutes] = useState<RoutePlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [tripsRes, driversRes, routesRes] = await Promise.all([
                    getAllTrips(),
                    getDrivers(),
                    getRoutes(),
                ]);
                setTrips(tripsRes.data);
                setDrivers(driversRes.data);
                setRoutes(routesRes.data);
            } catch (err) {
                console.error("Failed to load assignment data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Add a newly created trip to the shared trips list
    const handleCreateTrip = useCallback((newTrip: Trip) => {
        setTrips((prev) => [...prev, newTrip]);
    }, []);

    // Remove a trip by ID from the shared trips list
    const handleDeleteTrip = useCallback(async (tripId: string) => {
        try {
            setTrips((prev) => prev.filter((t) => t.id_ !== tripId));
            await deleteTrip(tripId);
        } catch (error) {
            console.error("Failed to delete trip:", error);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                Loading assignments…
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold">Route Assignment</h1>
                    <p className="text-md text-muted-foreground">
                        Assign routes and plan trips
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <AssignmentForm
                    driverOptions={drivers}
                    routeOptions={routes}
                    onCreated={handleCreateTrip}
                />

                {/* Enables Calendar/Table view toggle */}
                <div className="flex items-center rounded-lg border border-border bg-card p-px">
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`flex items-center gap-2 px-3.5 py-1 text-sm font-semibold rounded-md transition 
                            ${
                                viewMode === "calendar"
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary dark:hover:text-primary"
                            }`}
                    >
                        <CalendarDays size={16} />
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`flex items-center gap-2 px-3.5 py-1 text-sm font-semibold rounded-md transition 
                            ${
                                viewMode === "table"
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary dark:hover:text-primary"
                            }`}
                    >
                        <List size={16} />
                        Table
                    </button>
                    <button
                        onClick={() => setViewMode("driver")}
                        className={`flex items-center gap-2 px-3.5 py-1 text-sm font-semibold rounded-md transition 
                            ${
                                viewMode === "driver"
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary dark:hover:text-primary"
                            }`}
                    >
                        <User size={16} />
                        Driver
                    </button>
                </div>
            </div>

            {/* Displays views one-by-one */}
            {viewMode === "calendar" && (
                <CalendarView
                    trips={trips}
                    drivers={drivers}
                    onDeleted={handleDeleteTrip}
                />
            )}
            {viewMode === "table" && (
                <TableView trips={trips} onDeleted={handleDeleteTrip} />
            )}
            {viewMode === "driver" && <DriverView items={mockDriverDayData} />}
        </div>
    );
}
