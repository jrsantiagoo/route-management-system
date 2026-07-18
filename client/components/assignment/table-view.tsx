"use client";

import { useState, useCallback } from "react";
import {
    CalendarClock,
    Clock,
    MapPinned,
    Route,
    Search,
    ArchiveIcon,
    User,
} from "lucide-react";
import type { Trip } from "@/lib/routing/types";
import { useSort } from "@/lib/hooks/useSort";
import SortableHeader from "@/components/ui/sortable-header";
import FilterSelect from "../ui/filter-select";

interface TableViewProps {
    trips: Trip[];
    onDeleted: (tripId: string) => void;
}

function formatDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function TableView({ trips, onDeleted }: TableViewProps) {
    const [search, setSearch] = useState("");
    const [routeFilter, setRouteFilter] = useState("All");
    const [driverFilter, setDriverFilter] = useState("All");
    const [scheduledFilter, setScheduledFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // Needed for filtering options
    const routeOptions = [
        ...new Set(trips.map((t) => t.route?.name).filter(Boolean)),
    ] as string[];
    const driverOptions = [
        ...new Set(
            trips.map((t) => t.agent_profile?.driver_id).filter(Boolean),
        ),
    ] as string[];
    const scheduledOptions = [
        ...new Set(
            trips
                .map((t) => t.scheduled_date)
                .filter(Boolean)
                .map((d) => formatDate(d)),
        ),
    ] as string[];
    const statusOptions = [...new Set(trips.map((t) => t.status))];

    // Filter trips by route name or driver ID
    const filtered = trips.filter((t) => {
        const q = search.toLowerCase();
        const matchesSearch =
            t.route?.name?.toLowerCase().includes(q) ||
            t.agent_profile?.driver_id?.toLowerCase().includes(q) ||
            false;
        const matchesRoute =
            routeFilter === "All" || t.route?.name === routeFilter;
        const matchesDriver =
            driverFilter === "All" ||
            t.agent_profile?.driver_id === driverFilter;
        const matchesScheduled =
            scheduledFilter === "All" ||
            formatDate(t.scheduled_date) === scheduledFilter;
        const matchesStatus =
            statusFilter === "All" || t.status === statusFilter;
        return (
            matchesSearch &&
            matchesRoute &&
            matchesDriver &&
            matchesScheduled &&
            matchesStatus
        );
    });

    // Sort trips by the currently active column
    const getTripVal = useCallback((t: Trip, key: string) => {
        switch (key) {
            case "route":
                return t.route?.name ?? "";
            case "driver":
                return t.agent_profile?.driver_id ?? "";
            case "purpose":
                return t.purpose ?? "";
            case "destination":
                return t.destination ?? "";
            case "scheduled_date":
                return t.scheduled_date ?? "";
            case "created_at":
                return t.created_at ?? "";
            case "status":
                return t.status;
            default:
                return "";
        }
    }, []);
    const {
        sorted: sortedTrips,
        state: sortState,
        toggle: toggleSort,
    } = useSort(filtered, getTripVal);

    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            {/* Table Header + Filter + Search */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="-mt-4 text-base font-semibold text-foreground">
                    All Assignments
                </h3>

                {/* Filtered Search */}
                <div className="relative">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        type="text"
                        placeholder="Search by routes or drivers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 rounded-lg border border-gray-300 pl-8 pr-4 py-1.5 text-sm text-foreground outline-none transition 
                            focus:border-primary-foreground dark:bg-card placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Filter Options */}
            <div className="-mt-4 mb-3 flex flex-wrap gap-2">
                <FilterSelect
                    label="All Routes"
                    value={routeFilter}
                    options={routeOptions}
                    onChange={setRouteFilter}
                />
                <FilterSelect
                    label="All Drivers"
                    value={driverFilter}
                    options={driverOptions}
                    onChange={setDriverFilter}
                />
                <FilterSelect
                    label="All Scheduled Dates"
                    value={scheduledFilter}
                    options={scheduledOptions}
                    onChange={setScheduledFilter}
                />
                <FilterSelect
                    label="All Statuses"
                    value={statusFilter}
                    options={statusOptions}
                    onChange={setStatusFilter}
                />
            </div>

            {/* Route Assignment Table View */}
            <div className="overflow-auto max-h-128 rounded-lg scrollbar-thumb-muted-foreground">
                <table className="w-full text-left text-sm border-separate border-spacing-0 whitespace-nowrap">
                    <thead className="sticky top-0 bg-card">
                        <tr>
                            <SortableHeader
                                sortKey="route"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="rounded-tl-lg"
                            >
                                <Route
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Route
                            </SortableHeader>
                            <SortableHeader
                                sortKey="driver"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <User
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Driver
                            </SortableHeader>
                            <SortableHeader
                                sortKey="purpose"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                Purpose
                            </SortableHeader>
                            <SortableHeader
                                sortKey="destination"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <MapPinned
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Destination
                            </SortableHeader>
                            <SortableHeader
                                sortKey="scheduled_date"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <CalendarClock
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Scheduled Date
                            </SortableHeader>
                            <SortableHeader
                                sortKey="created_at"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <Clock
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Created At
                            </SortableHeader>
                            <SortableHeader
                                sortKey="status"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                Status
                            </SortableHeader>
                            <th className="px-3 py-2 font-semibold text-foreground border-b border-border">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTrips.map((t) => (
                            <tr
                                key={t.id_}
                                className="border-t border-border text-foreground transition hover:bg-secondary dark:hover:text-primary"
                            >
                                <td className="px-3 py-2 font-medium">
                                    {t.route?.name || "—"}
                                </td>
                                <td className="px-3 py-2">
                                    {t.agent_profile?.driver_id || "Unassigned"}
                                </td>
                                <td className="px-3 py-2">
                                    {t.purpose || "—"}
                                </td>
                                <td className="px-3 py-2">
                                    {t.destination || "—"}
                                </td>
                                <td className="px-3 py-2">
                                    {formatDate(t.scheduled_date)}
                                </td>
                                <td className="px-3 py-2">
                                    {formatDate(t.created_at)}
                                </td>
                                <td className="px-3 py-2">{t.status}</td>
                                <td className="pl-7 px-3 py-2">
                                    <button
                                        onClick={() => onDeleted(t.id_)}
                                        className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                                        title="Delete assignment"
                                    >
                                        <ArchiveIcon size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-3 py-8 text-center text-foreground"
                                >
                                    No assignments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
