"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import AssignmentFormModal from "./assignment-form-modal";
import { Driver, RoutePlan, Trip } from "@/lib/routing/types";
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

    // Build a MockTrip from the submitted form values and pass it up
    async function handleSave(data: Partial<Trip>) {
        const route = data.route;
        const driver = data.agent_profile;
        if (!route || !driver || !data.scheduled_date) return;

        let newTrip;
        try {
            const result = await createTrip(
                route.id_,
                driver.id_,
                data.scheduled_date,
            );
            newTrip = result.data as Trip;
        } catch (error) {
            console.error("Failed to create trip: ", error);
            return;
        }

        onCreated(newTrip);
        setOpen(false);
    }

    return (
        <div>
            {/* Enables Assignments */}
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center -mt-2 gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg border border-border bg-card 
                    text-foreground hover:bg-secondary dark:hover:text-primary transition duration-300 cursor-pointer"
            >
                <Plus size={16} />
                New Assignment
            </button>

            {open && (
                <AssignmentFormModal
                    routeOptions={routeOptions}
                    driverOptions={driverOptions}
                    onClose={() => setOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
