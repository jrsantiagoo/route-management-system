"use client";

import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import type { MockTrip } from "@/lib/assignment/mockData";

interface TableViewProps {
    trips: MockTrip[];
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

    // Filter trips by route name or driver ID
    const filtered = trips.filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            t.route?.name?.toLowerCase().includes(q) ||
            t.agent_profile?.driver_id?.toLowerCase().includes(q) ||
            false
        );
    });

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
                            <th className="px-3 py-2 font-semibold text-foreground border-b border-border">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
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
                        {filtered.map((t) => (
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
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => onDeleted(t.id_)}
                                        className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                                        title="Delete assignment"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
