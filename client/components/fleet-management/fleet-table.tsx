"use client";

import { useState, useCallback } from "react";
import {
    Search,
    ArchiveIcon,
    Eye,
    SquarePen,
    User,
    Van,
    Weight,
    CircleGauge,
    Ellipsis,
} from "lucide-react";
import type { Vehicle } from "@/lib/fleet-management/mockData";
import { useSort } from "@/lib/hooks/useSort";
import SortableHeader from "@/components/ui/sortable-header";
import FilterSelect from "../ui/filter-select";

interface VehicleProps {
    vehicles: Vehicle[];
    // onDeleted: (tripId: string) => void;
}

export default function FleetTable({ vehicles }: VehicleProps) {
    const [search, setSearch] = useState("");
    // const [routeFilter, setRouteFilter] = useState("All");
    // const [driverFilter, setDriverFilter] = useState("All");
    // const [scheduledFilter, setScheduledFilter] = useState("All");
    // const [statusFilter, setStatusFilter] = useState("All");

    // Needed for filtering options
    /*
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
    const statusOptions = [...new Set(trips.map((t) => t.status))]; */

    // Filter trips by route name or driver ID
    const filtered = vehicles.filter((v) => {
        const q = search.toLowerCase();
        const matchesSearch =
            v.plateNumber?.toLowerCase().includes(q) ||
            v.vehicleType?.toLowerCase().includes(q) ||
            false;
        return matchesSearch;
    });

    // Sort trips by the currently active column
    const getVehicleVal = useCallback((v: Vehicle, key: string) => {
        switch (key) {
            case "vehicle_plate":
                return v.plateNumber;
            case "vehicle_type":
                return v.vehicleType;
            case "last_driver":
                return v.lastDriver;
            case "weight_capacity":
                return v.weightCapacity.toString().padStart(5, "0");
            case "target":
                return v.target.toString().padStart(5, "0");
            case "avg_performance":
                return v.avg_performance?.toString().padStart(5, "0") ?? "";
            case "status":
                return v.status;
            default:
                return "";
        }
    }, []);
    const {
        sorted: sortedVehicles,
        state: sortState,
        toggle: toggleSort,
    } = useSort(filtered, getVehicleVal);

    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            {/* Table Header + Filter + Search */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-semibold">
                    <Van size={21} className="text-primary-foreground" />
                    <h3 className="mt-1 text-foreground">Vehicle Fleet</h3>
                </div>

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
            {/* <div className="-mt-4 mb-3 flex flex-wrap gap-2">
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
            </div> */}

            {/* Route Assignment Table View */}
            <div className="overflow-auto max-h-128 rounded-lg scrollbar-thumb-muted-foreground">
                <table className="w-full text-left text-sm border-separate border-spacing-0 whitespace-nowrap">
                    <thead className="sticky top-0 bg-card">
                        <tr>
                            <SortableHeader
                                sortKey="vehicle_plate"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="rounded-tl-lg"
                            >
                                <Van
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Vehicles
                            </SortableHeader>
                            <SortableHeader
                                sortKey="vehicle_type"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <Van
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Vehicle Type
                            </SortableHeader>
                            <SortableHeader
                                sortKey="last_driver"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <User
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Last Driver
                            </SortableHeader>
                            <SortableHeader
                                sortKey="weight_capacity"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <Weight
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Weight Capacity
                            </SortableHeader>
                            <SortableHeader
                                sortKey="target"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <CircleGauge
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Target Mileage
                            </SortableHeader>
                            <SortableHeader
                                sortKey="avg_performance"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                Avg. Performance
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
                        {sortedVehicles.map((v) => (
                            <tr
                                key={v.vehicleId_}
                                className="border-t border-border text-foreground transition hover:bg-secondary dark:hover:text-primary"
                            >
                                <td className="px-3 py-2 font-medium">
                                    <div className="font-medium">
                                        {v.plateNumber}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {v.vehicleId_}
                                    </div>
                                </td>
                                <td className="px-3 py-2 font-medium">
                                    {v.vehicleType}
                                </td>
                                <td className="px-3 py-2">
                                    {v.lastDriver == "" ? (
                                        <div className="italic text-muted-foreground">
                                            No assigned driver
                                        </div>
                                    ) : (
                                        v.lastDriver
                                    )}
                                </td>
                                <td className="px-3 py-2">
                                    {v.weightCapacity} kg
                                </td>
                                <td className="px-3 py-2">{v.target}</td>
                                <td className="px-3 py-2">
                                    {v.avg_performance ?? "—"}
                                </td>
                                <td className="px-3 py-2">{v.status}</td>
                                <td className="pl-7 px-3 py-2">
                                    <button
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
                                    No vehicles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
