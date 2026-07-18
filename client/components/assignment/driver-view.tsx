"use client";

import { useState, useCallback } from "react";
import { Clock, Fuel, Route, Search, User } from "lucide-react";
import { useSort } from "@/lib/hooks/useSort";
import SortableHeader from "@/components/ui/sortable-header";
import { DriverDayInfo } from "@/lib/assignment/mockData";

interface DriverViewProps {
    items: DriverDayInfo[];
}

export default function DriverView({ items }: DriverViewProps) {
    const [search, setSearch] = useState("");

    const filtered = items.filter((d) => {
        const q = search.toLowerCase();
        return (
            d.driverName.toLowerCase().includes(q) ||
            d.driverId.toLowerCase().includes(q)
        );
    });

    const getItemVal = useCallback((d: DriverDayInfo, key: string) => {
        switch (key) {
            case "driverName":
                return d.driverName;
            case "activeHours":
                return d.activeHours.toString().padStart(5, "0");
            case "fuelConsumed":
                return d.fuelConsumed.toString().padStart(5, "0");
            case "distanceTraveled":
                return d.distanceTraveled.toString().padStart(5, "0");
            case "status":
                return d.status;
            default:
                return "";
        }
    }, []);

    const {
        sorted: sortedItems,
        state: sortState,
        toggle: toggleSort,
    } = useSort(filtered, getItemVal);

    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="-mt-4 text-base font-semibold text-foreground">
                    Driver Overview
                </h3>

                <div className="relative">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        type="text"
                        placeholder="Search drivers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 rounded-lg border border-gray-300 pl-8 pr-4 py-1.5 text-sm text-foreground outline-none transition 
                            focus:border-primary-foreground dark:bg-card placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="overflow-auto max-h-128 rounded-lg scrollbar-thumb-muted-foreground">
                <table className="w-full text-left text-sm border-separate border-spacing-0 whitespace-nowrap">
                    <thead className="sticky top-0 bg-card">
                        <tr>
                            <SortableHeader
                                sortKey="driverName"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="rounded-tl-lg"
                            >
                                <User
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Driver
                            </SortableHeader>
                            <SortableHeader
                                sortKey="activeHours"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <Clock
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Active Hours
                            </SortableHeader>
                            <SortableHeader
                                sortKey="fuelConsumed"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <Fuel
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Fuel Consumed
                            </SortableHeader>
                            <SortableHeader
                                sortKey="distanceTraveled"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <Route
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Distance Traveled
                            </SortableHeader>
                            <SortableHeader
                                sortKey="status"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                Status
                            </SortableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map((d) => (
                            <tr
                                key={d.id_}
                                className="border-t border-border text-foreground transition hover:bg-secondary dark:hover:text-primary"
                            >
                                <td className="px-3 py-2">
                                    <div className="font-medium">
                                        {d.driverName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {d.driverId}
                                    </div>
                                </td>
                                <td className="px-3 py-2">
                                    {d.activeHours.toFixed(1)} hrs
                                </td>
                                <td className="px-3 py-2">
                                    {d.fuelConsumed.toFixed(1)} L
                                </td>
                                <td className="px-3 py-2">
                                    {d.distanceTraveled.toFixed(1)} km
                                </td>
                                <td className="px-3 py-2">{d.status}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-3 py-8 text-center text-foreground"
                                >
                                    No drivers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
