"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { MockTrip } from "@/lib/assignment/mockData";
import type { Driver } from "@/lib/routing/types";

interface CalendarViewProps {
    trips: MockTrip[];
    drivers: Driver[];
    onDeleted: (tripId: string) => void;
}

// Compute the Monday–Sunday range for a given date
function getWeekRange(date: Date) {
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((dayOfWeek + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { monday, sunday };
}

function formatDate(d: Date) {
    return d.toISOString().slice(0, 10);
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarView({
    trips,
    drivers,
    onDeleted,
}: CalendarViewProps) {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        return getWeekRange(new Date()).monday;
    });
    const [search, setSearch] = useState("");

    const weekRange = getWeekRange(currentWeekStart);
    const weekDates = DAYS.map((_, i) => {
        const d = new Date(weekRange.monday);
        d.setDate(weekRange.monday.getDate() + i);
        return d;
    });

    const weekStartStr = formatDate(weekRange.monday);
    const weekEndStr = formatDate(weekRange.sunday);

    // Filter trips that fall within the current week
    const weekTrips = trips.filter((t) => {
        if (!t.scheduled_date || !t.driver_id_ || !t.route) return false;
        const d = t.scheduled_date.slice(0, 10);
        return d >= weekStartStr && d <= weekEndStr;
    });

    // Build a grid keyed by driver_id -> day name -> assignments
    const grid: Record<
        string,
        Record<string, { tripId: string; routeName: string }[]>
    > = {};
    for (const trip of weekTrips) {
        const driverKey = trip.agent_profile?.driver_id || trip.driver_id_;
        const dayIndex = new Date(trip.scheduled_date).getDay();
        const dayName = DAYS[(dayIndex + 6) % 7];
        if (!grid[driverKey]) grid[driverKey] = {};
        if (!grid[driverKey][dayName]) grid[driverKey][dayName] = [];
        grid[driverKey][dayName].push({
            tripId: trip.id_,
            routeName: trip.route.name,
        });
    }

    // Filter drivers by the search query (matches against driver code)
    const filteredDrivers = drivers.filter((d) => {
        if (!search) return true;
        return d.driver_id.toLowerCase().includes(search.toLowerCase());
    });

    function prevWeek() {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() - 7);
        setCurrentWeekStart(d);
    }

    function nextWeek() {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + 7);
        setCurrentWeekStart(d);
    }

    const todayStr = formatDate(new Date());

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const startMonth = monthNames[weekRange.monday.getMonth()];
    const endMonth = monthNames[weekRange.sunday.getMonth()];
    const weekLabel =
        startMonth === endMonth
            ? `${startMonth} ${weekRange.monday.getDate()} – ${weekRange.sunday.getDate()}, ${weekRange.monday.getFullYear()}`
            : `${startMonth} ${weekRange.monday.getDate()} – ${endMonth} ${weekRange.sunday.getDate()}, ${weekRange.monday.getFullYear()}`;

    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground">
                    {weekLabel}
                </h3>
                <div className="flex items-center gap-1">
                    {/* Enables calendar to view previous week */}
                    <button
                        onClick={prevWeek}
                        className="p-1 rounded-md hover:bg-secondary dark:hover:text-primary transition"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {/* Enables calendar to view current week */}
                    <button
                        onClick={() =>
                            setCurrentWeekStart(getWeekRange(new Date()).monday)
                        }
                        className="px-3 py-1 text-xs font-semibold rounded-md border border-border 
                            dark:border-foreground hover:bg-secondary dark:hover:text-primary transition"
                    >
                        Today
                    </button>
                    {/* Enables calendar to view next week */}
                    <button
                        onClick={nextWeek}
                        className="p-1 rounded-md hover:bg-secondary dark:hover:text-primary transition"
                    >
                        <ChevronRight size={18} />
                    </button>
                    {/* Filtered Search */}
                    <div className="ml-1.5 relative">
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

            <div className="overflow-auto max-h-96 rounded-lg border border-border scrollbar-thumb-muted-foreground">
                <table className="w-full text-sm border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <th className="sticky left-0 bg-card z-10 px-2 py-2 text-left font-semibold text-foreground border-r border-b border-border rounded-tl-lg min-w-30">
                                Driver
                            </th>
                            {weekDates.map((d, i) => {
                                const dateStr = formatDate(d);
                                const isToday = dateStr === todayStr;
                                return (
                                    <th
                                        key={i}
                                        className={`px-2 py-2 text-center font-semibold border-r border-b border-border min-w-25 ${
                                            i === 6 ? "rounded-tr-lg" : ""
                                        } ${
                                            isToday
                                                ? "bg-primary/10 text-primary-foreground"
                                                : "text-foreground"
                                        }`}
                                    >
                                        <div>{DAYS[i]}</div>
                                        <div className="text-xs font-normal">
                                            {d.getMonth() + 1}/{d.getDate()}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-3 py-8 text-center text-muted-foreground"
                                >
                                    No drivers available.
                                </td>
                            </tr>
                        )}
                        {filteredDrivers.map((driver) => (
                            <tr key={driver.id_}>
                                <td className="sticky left-0 bg-card z-10 px-2 py-2 font-medium text-foreground border-r border-b border-border">
                                    {driver.driver_id}
                                </td>
                                {DAYS.map((day) => {
                                    const assignments =
                                        grid[driver.driver_id]?.[day] || [];
                                    return (
                                        <td
                                            key={day}
                                            className={`px-1 py-1 border-r border-b border-border align-top ${
                                                assignments.length === 0
                                                    ? "text-muted-foreground"
                                                    : ""
                                            }`}
                                        >
                                            {assignments.length === 0 ? (
                                                <span className="text-xs px-1">
                                                    —
                                                </span>
                                            ) : (
                                                <div className="flex flex-col gap-0.5">
                                                    {assignments.map((a) => (
                                                        <div
                                                            key={a.tripId}
                                                            className="group flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded px-2 py-0.5 text-xs gap-1"
                                                        >
                                                            <span className="truncate">
                                                                {a.routeName}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    onDeleted(
                                                                        a.tripId,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 leading-none"
                                                                title="Remove assignment"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
