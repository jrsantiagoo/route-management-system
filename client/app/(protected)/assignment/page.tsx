"use client";

import { useState } from "react";
import { CalendarDays, List } from "lucide-react";
import AssignmentForm from "@/components/assignment/assignment-form";
import CalendarView from "@/components/assignment/calendar-view";
import TableView from "@/components/assignment/table-view";

export default function Assignment() {
    const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
    const [refreshKey, setRefreshKey] = useState(0);

    function handleRefresh() {
        setRefreshKey((k) => k + 1);
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold">Route Assignment</h1>
                    <p className="text-md text-muted-foreground">
                        Assign Routes and Plan Trips
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <AssignmentForm onCreated={handleRefresh} />

                {/* Enables Calendar/Table view toggle */}
                <div className="flex items-center rounded-lg border border-border bg-card p-px">
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`flex items-center gap-2 px-3.5 py-1 text-sm font-semibold rounded-md transition 
                            ${
                                viewMode === "calendar"
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary dark:hover:text-primary"
                            }`}
                    >
                        <CalendarDays size={16} />
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`flex items-center gap-2 px-3.5 py-1 text-sm font-semibold rounded-md transition 
                            ${
                                viewMode === "table"
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary dark:hover:text-primary"
                            }`}
                    >
                        <List size={16} />
                        Table
                    </button>
                </div>
            </div>

            {viewMode === "calendar" ? (
                <CalendarView refreshKey={refreshKey} />
            ) : (
                <TableView refreshKey={refreshKey} onDeleted={handleRefresh} />
            )}
        </div>
    );
}
