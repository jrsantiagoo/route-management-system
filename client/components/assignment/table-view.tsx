"use client";

import { useState, useEffect } from "react";
import {
    CalendarClock,
    Clock,
    MapPin,
    Route,
    Search,
    Trash2,
    User,
} from "lucide-react";
import { getAllTrips, deleteTrip } from "@/lib/api/trips";

interface TableViewProps {
    refreshKey: number;
    onDeleted: () => void;
}

export default function TableView({ refreshKey, onDeleted }: TableViewProps) {
    const [trips, setTrips] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAllTrips()
            .then((res) => {
                if (res.success) setTrips(res.data);
            })
            .finally(() => setLoading(false));
    }, [refreshKey]);

    async function handleDelete(tripId: string) {
        const res = await deleteTrip(tripId);
        if (res.success) {
            onDeleted();
        }
    }

    const filtered = trips.filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            t.route?.name?.toLowerCase().includes(q) ||
            t.agent_profile?.driver_id?.toLowerCase().includes(q) ||
            ""
        );
    });

    const statusColors: Record<string, string> = {
        COMPLETED: "bg-green-100 text-green-800",
        PROCESSING: "bg-blue-100 text-blue-800",
        FAILED: "bg-red-100 text-red-800",
        CANCELLED: "bg-red-100 text-red-800",
        PENDING: "bg-yellow-100 text-yellow-800",
    };

    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="-mt-6 text-base font-semibold text-foreground">
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

            {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                    Loading...
                </div>
            ) : (
                <div className="overflow-auto max-h-96 scrollbar-thumb-muted-foreground">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="sticky top-0 bg-card">
                            <tr>
                                <th className="px-3 py-2 font-semibold text-foreground border-b border-border">
                                    Route
                                </th>
                                <th className="px-3 py-2 font-semibold text-foreground border-b border-border">
                                    Driver
                                </th>
                                <th className="px-3 py-2 font-semibold text-foreground border-b border-border">
                                    Purpose
                                </th>
                                <th className="px-3 py-2 font-semibold text-foreground border-b border-border">
                                    Destination
                                </th>
                                <th className="px-3 py-2 font-semibold text-foreground border-b border-border">
                                    Scheduled Date
                                </th>
                                <th className="px-3 py-2 font-semibold text-foreground border-b border-border">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((t) => (
                                <tr
                                    key={t.id_}
                                    className="border-t border-border text-foreground transition hover:bg-secondary dark:hover:text-primary"
                                >
                                    <td className="px-3 py-2 font-medium">
                                        {t.route?.name || "—"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {t.agent_profile?.driver_id ||
                                            "Unassigned"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {t.scheduled_date
                                            ? new Date(
                                                  t.scheduled_date,
                                              ).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span
                                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                                statusColors[t.status] ||
                                                "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {t.status || "PENDING"}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <button
                                            onClick={() => handleDelete(t.id_)}
                                            className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                                            title="Delete assignment"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-3 py-8 text-center text-foreground"
                                    >
                                        No assignments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
