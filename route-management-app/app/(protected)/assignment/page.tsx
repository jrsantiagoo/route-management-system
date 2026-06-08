"use client";

import { useState } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";

import DraggableCard from "@/components/draggable-card";
import AssignmentCell from "@/components/assignment-cell";
import RouteCard from "@/components/route-card";

// Placeholder data for drivers
const DRIVERS = [
    "Driver 1",
    "Driver 2",
    "Driver 3",
    "Driver 4",
    "Driver 5",
    "Driver 6",
    "Driver 7",
    "Driver 8",
    "Driver 9",
    "Driver 10",
    "Driver 11",
    "Driver 12",
    "Driver 13",
    "Driver 14",
    "Driver 15",
    "Driver 16",
    "Driver 17",
    "Driver 18",
    "Driver 19",
    "Driver 20",
    "Driver 21",
    "Driver 22",
    "Driver 23",
    "Driver 24",
];

// Placeholder data for routes
const ROUTES = [
    "Route A",
    "Route B",
    "Route C",
    "Route D",
    "Route E",
    "Route F",
    "Route G",
    "Route H",
    "Route I",
    "Route J",
    "Route K",
    "Route L",
    "Route M",
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Assignment() {
    // Stores route assignments so that UI can track which card is placed in each cell
    const [assignments, setAssignments] = useState<Record<string, string[]>>(
        {},
    );

    // Stores the dragged route card so drag overlay can render even while original element is being moved
    const [activeRoute, setActiveRoute] = useState<string | null>(null);

    // Records which route card is being dragged so that drag overlay is shown
    function handleDragStart(event: DragStartEvent) {
        setActiveRoute(String(event.active.id));
    }

    // Creates route card-to-cell assignment when drag operation is done
    function handleDragEnd(event: DragEndEvent) {
        const route = String(event.active.id);
        const cellId = event.over?.id?.toString();

        // Ignores invalid drops to prevent creating assignments for non-existing cells
        if (!cellId) return;
        // Adds route card to target cell, while preserving existing elements
        setAssignments((prev) => ({
            ...prev,
            [cellId]: [...(prev[cellId] || []), route],
        }));

        setActiveRoute(null);
    }

    // Allows user to delete existing route assignments
    function deleteCard(cellId: string, cardIndex: number) {
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
                            <DraggableCard key={route} route={route} />
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
                                    key={driver}
                                    className="grid grid-cols-[172px_repeat(7,1fr)] "
                                >
                                    <div className="p-2">{driver}</div>
                                    {/* Allows the creation of assignment cells */}
                                    {DAYS_OF_WEEK.map((day) => {
                                        const cellId = `${driver}-${day}`;
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
