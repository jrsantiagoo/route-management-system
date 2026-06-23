"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";

import DraggableCard from "@/components/assignment/draggable-card";
import AssignmentCell from "@/components/assignment/assignment-cell";
import RouteCard from "@/components/assignment/route-card";
import * as types from "@/lib/routing/types";
import * as routesApi from "@/lib/api/routes";
import * as driversApi from "@/lib/api/drivers";
import * as tripsApi from "@/lib/api/trips";

const DRIVERS = (await driversApi.getDrivers()).data as types.Driver[];

const ROUTES = (await routesApi.getRoutes()).data as types.RoutePlan[];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getNextDateForDay(dayName: string): string {
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const targetDay = DAYS.indexOf(dayName);
    const diff = (targetDay - today.getDay() + 7) % 7 || 7;
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    return date.toISOString();
}

export default function Assignment() {
    const [drivers, setDrivers] = useState<types.Driver[]>([]);
    const [routes, setRoutes] = useState<types.RoutePlan[]>([]);

    /*
    // Stores route assignments so that UI can track which card is placed in each cell
    const [assignments, setAssignments] = useState<Record<string, string[]>>(
        {},
    );

    // Stores the dragged route card so drag overlay can render even while original element is being moved
    const [activeRoute, setActiveRoute] = useState<string | null>(null);

    */
    // Now stores { cellId: [{ tripId, routeName }] } instead of just strings
    const [assignments, setAssignments] = useState<
        Record<string, { tripId: string; routeName: string }[]>
    >({});
    const [activeRoute, setActiveRoute] = useState<string | null>(null);
    // Records which route card is being dragged so that drag overlay is shown

    useEffect(() => {
        async function loadData() {
            const [driversRes, routesRes, gridRes] = await Promise.all([
                driversApi.getDrivers(),
                routesApi.getRoutes(),
                tripsApi.getAssignmentGrid(),
            ]);
            setDrivers(driversRes.data);
            setRoutes(routesRes.data);
            setAssignments(gridRes.data); // pre-populate from existing trips
        }
        loadData();
    }, []);

    function handleDragStart(event: DragStartEvent) {
        setActiveRoute(String(event.active.id));
    }

    // Creates route card-to-cell assignment when drag operation is done
    async function handleDragEnd(event: DragEndEvent) {
        const routeName = String(event.active.id);
        const cellId = event.over?.id?.toString();

        // Ignores invalid drops to prevent creating assignments for non-existing cells
        if (!cellId) return;
        // Adds route card to target cell, while preserving existing elements

        const lastDash = cellId.lastIndexOf("-");
        const driverPublicId = cellId.substring(0, lastDash);
        const day = cellId.substring(lastDash + 1);

        // Find internal driver id_ from driver_id
        const driver = drivers.find((d) => d.driver_id === driverPublicId);
        const route = routes.find((r) => r.name === routeName);
        if (!driver || !route) return;

        try {
            // Create trip in backend
            console.log(route, driver);
            const res = await tripsApi.createTrip(
                route.id_,
                driver.id_,
                getNextDateForDay(day),
            );

            if (!res.success || !res.data) {
                console.error("Trip creation failed:", res);
                return;
            }
            const newTrip = { tripId: res.data.id_, routeName };

            setAssignments((prev) => ({
                ...prev,
                [cellId]: [...(prev[cellId] || []), newTrip],
            }));
        } catch (err) {
            console.error("Failed to create trip:", err);
        }
        /*
        setAssignments((prev) => ({
            ...prev,
            [cellId]: [...(prev[cellId] || []), route],
        }));
        */

        setActiveRoute(null);
    }

    // Allows user to delete existing route assignments
    async function deleteCard(cellId: string, cardIndex: number) {
        const card = assignments[cellId]?.[cardIndex];
        if (!card) return;

        try {
            // delete from backend
            await tripsApi.deleteTrip(card.tripId);
        } catch (err) {
            console.error("Failed to delete trip:", err);
            return;
        }

        setAssignments((prev) => {
            const copy = { ...prev };

            // Removes the selected card, while preserving the order of any remaining assignments
            copy[cellId] = copy[cellId].filter(
                (_, index) => index !== cardIndex,
            );
            // Remove empty cells entirely
            if (copy[cellId].length === 0) {
                delete copy[cellId];
            }

            return copy;
        });
    }

    return (
        // Allows drag and drop operation
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <main className="flex font-bold min-h-screen gap-5.5">
                {/* Displays the list of routes */}
                <div className="flex flex-col text-left rounded-md w-67 max-h-118 bg-white shadow-lg shadow-gray-400">
                    {/* Displays header and search bar */}
                    <div className="p-2 rounded-t border-b border-gray-200">
                        <h2>Saved Routes</h2>
                        {/* <input
                            type="text"
                            placeholder="Search routes..."
                            className="font-normal border border-gray-200 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        /> */}
                    </div>

                    {/* Automatically adds placeholder ROUTES as draggable cards */}
                    <div className="flex flex-col gap-1.5 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                        {ROUTES.map((route) => (
                            <DraggableCard
                                key={route.name}
                                route={route.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Displays the rooute assignment table */}
                <div className="p-4 w-250 h-184 rounded-md bg-white shadow-lg shadow-gray-400">
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                        {/* Displays header */}
                        <div className="sticky top-0 z-10 grid grid-cols-[172px_repeat(7,1fr)] rounded-t-md text-center border-b-2 bg-gray-200 border-gray-300">
                            <div className="p-2">Drivers</div>

                            {/* Automatically adds DAY_OF_WEEK columns*/}
                            {DAYS_OF_WEEK.map((day) => (
                                <div key={day} className="w-28 h-12 p-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Automatically adds placeholder DRIVERS values as rows*/}
                        <div>
                            {DRIVERS.map((driver) => (
                                <div
                                    key={driver.driver_id}
                                    className="grid grid-cols-[172px_repeat(7,1fr)] "
                                >
                                    <div className="p-2">
                                        {driver.driver_id}
                                    </div>
                                    {/* Allows the creation of assignment cells */}
                                    {DAYS_OF_WEEK.map((day) => {
                                        const cellId = `${driver.driver_id}-${day}`;
                                        return (
                                            <AssignmentCell
                                                key={cellId}
                                                id={cellId}
                                                routes={
                                                    assignments[cellId] || []
                                                }
                                                onDelete={deleteCard}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            {/* Displays drag overlay of route cards */}
            <DragOverlay>
                {activeRoute ? <RouteCard route={activeRoute} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
