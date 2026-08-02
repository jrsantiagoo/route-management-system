"use client";

import { useState, useCallback } from "react";
import {
    CalendarClock,
    ClipboardList,
    Clock,
    Eye,
    MapPinned,
    Route,
    Search,
    PenLine,
    ArchiveIcon,
    User,
    Fuel,
    Ellipsis,
    Van,
    RotateCcw,
} from "lucide-react";
import type { Trip } from "@/lib/routing/types";
import { useSort } from "@/lib/hooks/useSort";
import SortableHeader from "@/components/ui/sortable-header";
import FilterSelect from "../ui/filter-select";
import { useTableActionsMenu } from "@/lib/hooks/useTableActionsMenu";
import { TableActionsMenu } from "@/components/ui/table-actions-menu";
import StatusBadge from "@/components/ui/status-badge";

interface TableViewProps {
    trips: Trip[];
    archivedIds?: string[];

    onView?: (tripId: string) => void;
    onEdit?: (trip: Trip) => void;
    onArchive?: (tripId: string) => void;
    onUnarchive?: (tripId: string) => void;
}

function formatDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function TableView({
    trips,
    archivedIds,
    onView,
    onEdit,
    onArchive,
    onUnarchive,
}: TableViewProps) {
    const [search, setSearch] = useState("");
    // Toggles between the Active and Archived views
    const [view, setView] = useState<"active" | "archived">("active");
    const [routeFilter, setRouteFilter] = useState("All");
    const [driverFilter, setDriverFilter] = useState("All");
    const [scheduledFilter, setScheduledFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const { activeMenu, setActiveMenu, anchor, menuRef, openMenu } =
        useTableActionsMenu();

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

    // Used to determine whether a trip belongs to the Active or Archived view
    const isArchived = (t: Trip) => archivedIds?.includes(t.id_) ?? false;

    // Filter trips by the selected view, then by route name or driver ID
    const filtered = trips
        .filter((t) => (view === "archived" ? isArchived(t) : !isArchived(t)))
        .filter((t) => {
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
            case "vehicle":
                return "";
            case "purpose":
                return t.purpose ?? "";
            case "fuelConsumed":
                return "";
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
                <div className="flex -mt-4 items-center gap-2 text-base font-semibold">
                    <ClipboardList
                        size={21}
                        className="text-primary-foreground"
                    />
                    <h3 className="mt-1 text-foreground">All Assignments</h3>
                </div>

                {/* Active / Archived toggle + Filtered Search */}
                <div className="flex items-center gap-2">
                    {/* Active / Archived toggle */}
                    <div className="flex items-center rounded-lg border border-border bg-card">
                        {(["active", "archived"] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`flex items-center px-3.5 py-1.5 text-sm font-semibold rounded-md transition capitalize
                                    ${
                                        view === v
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-secondary dark:hover:text-primary"
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
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
                    <thead className="sticky top-0 z-10 bg-card">
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
                                sortKey="vehicle"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                <Van
                                    size={16}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Vehicle
                            </SortableHeader>
                            <SortableHeader
                                sortKey="purpose"
                                sortState={sortState}
                                onToggle={toggleSort}
                            >
                                Purpose
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
                                className="border-t border-border text-foreground hover:bg-muted-foreground/15 transition"
                            >
                                <td className="px-3 py-2 font-medium">
                                    {t.route?.name || "—"}
                                </td>
                                <td className="px-3 py-2">
                                    {t.agent_profile?.driver_id || "Unassigned"}
                                </td>
                                <td className="px-3 py-2">{"—"}</td>
                                <td className="px-3 py-2">
                                    {t.purpose || "—"}
                                </td>
                                <td className="px-3 py-2">—</td>
                                <td className="px-3 py-2">
                                    {formatDate(t.scheduled_date)}
                                </td>
                                <td className="px-3 py-2">
                                    {formatDate(t.created_at)}
                                </td>
                                <td className="px-3 py-2">
                                    <StatusBadge status={t.status} />
                                </td>
                                <td className="pl-7 px-3 py-2 relative">
                                    <button
                                        onClick={(e) => openMenu(t.id_, e)}
                                        className="p-1 rounded-md text-muted-foreground bg-card border border-border
                                            hover:bg-secondary hover:text-primary-foreground dark:text-foreground transition
                                            cursor-pointer"
                                        title="More actions"
                                    >
                                        <Ellipsis size={16} />
                                    </button>

                                    {activeMenu === t.id_ && anchor && (
                                        <TableActionsMenu
                                            ref={menuRef}
                                            // Menu renders in a viewport-fixed portal so it pops out of the scroll container
                                            anchor={anchor}
                                            actions={[
                                                {
                                                    label: "View",
                                                    icon: <Eye size={15} />,
                                                    onClick: () => {
                                                        onView?.(t.id_);
                                                        setActiveMenu(null);
                                                    },
                                                },
                                                {
                                                    label: "Edit",
                                                    icon: <PenLine size={15} />,
                                                    onClick: () => {
                                                        onEdit?.(t);
                                                        setActiveMenu(null);
                                                    },
                                                },
                                                {
                                                    label:
                                                        view === "archived"
                                                            ? "Unarchive"
                                                            : "Archive",
                                                    icon:
                                                        view === "archived" ? (
                                                            <RotateCcw
                                                                size={15}
                                                            />
                                                        ) : (
                                                            <ArchiveIcon
                                                                size={15}
                                                            />
                                                        ),
                                                    onClick: () => {
                                                        if (
                                                            view === "archived"
                                                        ) {
                                                            onUnarchive?.(
                                                                t.id_,
                                                            );
                                                        } else {
                                                            onArchive?.(t.id_);
                                                        }
                                                        setActiveMenu(null);
                                                    },
                                                    variant: "danger",
                                                },
                                            ]}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-3 py-8 text-center text-foreground"
                                >
                                    {view === "archived"
                                        ? "No archived assignments."
                                        : "No assignments found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
