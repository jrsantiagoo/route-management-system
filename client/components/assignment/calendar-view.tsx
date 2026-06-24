"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getAllTrips } from "@/lib/api/trips";
import { getDrivers } from "@/lib/api/drivers";
import RouteCard from "@/components/assignment/route-card";

interface CalendarViewProps {
    refreshKey: number;
}

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

export default function CalendarView({ refreshKey }: CalendarViewProps) {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        return getWeekRange(new Date()).monday;
    });
    const [trips, setTrips] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const weekRange = getWeekRange(currentWeekStart);
    const weekDates = DAYS.map((_, i) => {
        const d = new Date(weekRange.monday);
        d.setDate(weekRange.monday.getDate() + i);
        return d;
    });

    useEffect(() => {
        setLoading(true);
        Promise.all([getAllTrips(), getDrivers()])
            .then(([tripsRes, driversRes]) => {
                if (tripsRes.success) setTrips(tripsRes.data);
                if (driversRes.success) setDrivers(driversRes.data);
            })
            .finally(() => setLoading(false));
    }, [refreshKey]);

    const weekStartStr = formatDate(weekRange.monday);
    const weekEndStr = formatDate(weekRange.sunday);

    const weekTrips = trips.filter((t: any) => {
        if (!t.scheduled_date || !t.driver_id_ || !t.route) return false;
        const d = t.scheduled_date.slice(0, 10);
        return d >= weekStartStr && d <= weekEndStr;
    });

    const grid: Record<string, Record<string, any[]>> = {};
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
                    <button
                        onClick={prevWeek}
                        className="p-1 rounded-md hover:bg-secondary dark:hover:text-primary transition"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() =>
                            setCurrentWeekStart(getWeekRange(new Date()).monday)
                        }
                        className="px-3 py-1 text-xs font-semibold rounded-md border border-border 
                            hover:bg-secondary dark:hover:text-primary transition"
                    >
                        Today
                    </button>
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

            {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                    Loading...
                </div>
            ) : (
                <div className="overflow-auto max-h-96 scrollbar-thumb-muted-foreground">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                <th className="sticky left-0 bg-card z-10 px-2 py-2 text-left font-semibold text-foreground border border-border min-w-30">
                                    Driver
                                </th>
                                {weekDates.map((d, i) => {
                                    const dateStr = formatDate(d);
                                    const isToday = dateStr === todayStr;
                                    return (
                                        <th
                                            key={i}
                                            className={`px-2 py-2 text-center font-semibold border border-border min-w-25 ${
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
                            {drivers.map((driver) => (
                                <tr key={driver.id_}>
                                    <td className="sticky left-0 bg-card z-10 px-2 py-2 font-medium text-foreground border border-border">
                                        {driver.driver_id}
                                    </td>
                                    {DAYS.map((day) => {
                                        const assignments =
                                            grid[driver.driver_id]?.[day] || [];
                                        return (
                                            <td
                                                key={day}
                                                className={`px-1 py-1 border border-border align-top ${
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
                                                    <div className="flex flex-col gap-1">
                                                        {assignments.map(
                                                            (a: any) => (
                                                                <RouteCard
                                                                    key={
                                                                        a.tripId
                                                                    }
                                                                    route={
                                                                        a.routeName
                                                                    }
                                                                />
                                                            ),
                                                        )}
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
            )}
        </div>
    );
}
