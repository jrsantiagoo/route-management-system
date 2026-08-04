"use client";

import { CalendarDays, CirclePlus, Route, User, Van } from "lucide-react";
import { useState } from "react";
import FormSelect from "../ui/form-select";
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
    const [selectedRoute, setSelectedRoute] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState("");
    const [selectedDriver, setSelectedDriver] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [notes, setNotes] = useState("");
    const [date, setDate] = useState(
        () => new Date().toISOString().split("T")[0],
    );

    const allFieldsFilled =
        selectedRoute && selectedPurpose && selectedDriver && date;

    function handleClose() {
        setOpen(false);
        setSelectedRoute("");
        setSelectedPurpose("");
        setSelectedDriver("");
        setSelectedVehicle("");
        setDate("");
    }

    function handleCancel() {
        handleClose();
    }

    // Build a MockTrip from the selected form values and pass it up
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        const route = routeOptions.find((r) => r.name === selectedRoute);
        const driver = driverOptions.find(
            (d) => d.driver_id === selectedDriver,
        );
        if (!route || !driver) return;

        let newTrip;
        try {
            const result = await createTrip(route.id_, driver.id_, date);
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
                    text-foreground hover:bg-secondary dark:hover:text-primary transition duration-300"
            >
                <CirclePlus size={16} />
                New Assignment
            </button>

            {open && (
                // Background Overlay
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => handleClose()}
                >
                    {/* Form Modal */}
                    <div
                        className="mt-2 p-8 w-160 bg-card border border-border rounded-lg shadow shadow-muted-foreground"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Text */}
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground mb-3">
                                Create new assignment
                            </h2>
                            <p className="-mt-3 text-md text-muted-foreground">
                                Assign a trip to a driver. Fill in all required
                                details.
                            </p>
                        </div>

                        {/* Form Details */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col mt-4 gap-3"
                        >
                            {/* Date Picker */}
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-1 items-center">
                                    <CalendarDays
                                        size={17}
                                        className="text-muted-foreground"
                                    />
                                    <label className="pt-0.5 text-sm font-semibold text-foreground">
                                        Scheduled Date{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-background border border-gray-300 rounded-md px-3 py-1.5 text-sm text-foreground 
                                            focus:outline-none focus:ring-2 focus:ring-primary-foreground dark:scheme-dark"
                                />
                            </div>

                            {/* Selection Fields */}
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1 w-50">
                                    <div className="flex gap-1 items-center">
                                        <Route
                                            size={17}
                                            className="text-muted-foreground"
                                        />
                                        <label className="text-sm font-semibold text-foreground">
                                            Route{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                    </div>
                                    <FormSelect
                                        value={selectedRoute}
                                        onChange={setSelectedRoute}
                                        options={routeOptions.map(
                                            (r) => r.name,
                                        )}
                                        placeholder="Select a route"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 w-50">
                                    <label className="text-sm font-semibold text-foreground">
                                        Purpose{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <FormSelect
                                        value={selectedPurpose}
                                        onChange={setSelectedPurpose}
                                        options={["General", "Delivery"]}
                                        placeholder="Select purpose"
                                    />
                                </div>
                                <div className="flex gap-10">
                                    <div className="flex flex-col gap-1 w-50">
                                        <div className="flex gap-1 items-center">
                                            <User
                                                size={17}
                                                className="text-muted-foreground"
                                            />
                                            <label className="text-sm font-semibold text-foreground">
                                                Driver{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                        </div>
                                        <FormSelect
                                            value={selectedDriver}
                                            onChange={setSelectedDriver}
                                            options={driverOptions.map(
                                                (d) => d.driver_id,
                                            )}
                                            placeholder="Select a driver"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 w-50">
                                        <div className="flex gap-1 items-center">
                                            <Van
                                                size={19}
                                                className="text-muted-foreground"
                                            />
                                            <label className="text-sm font-semibold text-foreground">
                                                Vehicle
                                                <span className="ml-1.5 text-xs text-muted-foreground">
                                                    (Optional)
                                                </span>
                                            </label>
                                        </div>
                                        <FormSelect
                                            value={selectedVehicle}
                                            onChange={setSelectedVehicle}
                                            options={routeOptions.map(
                                                (r) => r.name,
                                            )}
                                            placeholder="Select a vehicle"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Optional Notes */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-foreground">
                                    Notes
                                    <span className="ml-1.5 text-xs text-muted-foreground">
                                        (Optional)
                                    </span>
                                </label>
                                <textarea
                                    placeholder="Any special instructions"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="bg-background border border-gray-300 rounded-md px-3 py-1.5 text-sm text-foreground 
                                        focus:outline-none focus:ring-2 focus:ring-primary-foreground dark:scheme-dark resize-none"
                                ></textarea>
                            </div>

                            {/* Form Buttons */}
                            <div className="flex font-semibold justify-end gap-2 mt-3.5">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-5 py-1.5 text-md rounded-md border border-border text-foreground hover:bg-secondary dark:hover:text-primary transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!allFieldsFilled}
                                    className={`px-5.5 py-1.5 text-md rounded-md transition duration-350 
                                        ${
                                            allFieldsFilled
                                                ? "bg-primary text-primary-foreground hover:bg-secondary"
                                                : "bg-muted-foreground text-background cursor-not-allowed"
                                        }`}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
