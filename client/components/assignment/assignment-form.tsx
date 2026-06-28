"use client";

import { useState, useRef, useEffect } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import type { Trip } from "@/lib/routing/types";
import type { RoutePlan } from "@/lib/routing/types";
import type { Driver } from "@/lib/routing/types";
import FilterSelect from "../ui/filter-select";
import { createTrip } from "@/lib/api/trips";

interface AssignmentFormProps {
    routeOptions: RoutePlan[];
    driverOptions: Driver[];
    onCreated: (newTrip: Trip) => void;
}

export default function AssignmentForm({
    routeOptions,
    driverOptions,
    onCreated,
}: AssignmentFormProps) {
    const [open, setOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState("All");
    const [selectedDriver, setSelectedDriver] = useState("All");
    const [date, setDate] = useState(
        () => new Date().toISOString().split("T")[0],
    );
    const ref = useRef<HTMLDivElement>(null);

    // Close the panel when clicking outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Build a MockTrip from the selected form values and pass it up
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (selectedRoute === "All" || selectedDriver === "All" || !date)
            return;

        const route = routeOptions.find((r) => r.name === selectedRoute);
        const driver = driverOptions.find(
            (d) => d.driver_id === selectedDriver,
        );
        if (!route || !driver) return;

        let newTrip;
        try {
            newTrip = (await createTrip(route.id_, driver.id_, date))
                .data as Trip;
            console.log("success");
        } catch (error) {
            console.error("Failed to create trip: ", error);
            return;
        }

        onCreated(newTrip);
        setOpen(false);
    }

    function handleCancel() {
        setOpen(false);
    }

    return (
        <div ref={ref} className="relative">
            {/* Enables Assignments */}
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center -mt-2 gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg border border-border bg-card 
                    text-foreground hover:bg-secondary dark:hover:text-primary transition duration-300"
            >
                {open ? <CircleMinus size={16} /> : <CirclePlus size={16} />}
                New Assignment
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-2 p-4 w-60 z-30 bg-card border border-border rounded-md shadow shadow-muted-foreground">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                        Create Assignment
                    </h4>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted-foreground">
                                Route
                            </label>
                            <FilterSelect
                                label="Select Route"
                                value={selectedRoute}
                                options={routeOptions.map((r) => r.name)}
                                onChange={setSelectedRoute}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted-foreground">
                                Driver
                            </label>
                            <FilterSelect
                                label="Select Driver"
                                value={selectedDriver}
                                options={driverOptions.map((d) => d.driver_id)}
                                onChange={setSelectedDriver}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted-foreground">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-background border border-gray-300 rounded-md px-3 py-1.5 text-sm text-foreground 
                                    focus:outline-none focus:ring-2 focus:ring-primary-foreground dark:scheme-dark"
                                required
                            />
                        </div>

                        <div className="flex font-semibold justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3.5 py-0.5 text-sm rounded-md border border-border text-foreground hover:bg-secondary dark:hover:text-primary transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3.5 py-0.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-secondary transition"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
