"use client";

import {
    Activity,
    Building2,
    Calendar,
    Car,
    Fuel,
    Gauge,
    X,
} from "lucide-react";
import { useState } from "react";
import FormSelect from "../ui/form-select";
import type { Vehicle } from "@/lib/fleet-management/mockData";

interface VehicleFormModalProps {
    initialData?: Vehicle | null;
    onClose: () => void;
    onSave: (data: Partial<Vehicle>) => void | Promise<void>;
}

export default function VehicleFormModal({
    initialData,
    onClose,
    onSave,
}: VehicleFormModalProps) {
    const isEdit = !!initialData;

    const [plateNumber, setPlateNumber] = useState(
        initialData?.plateNumber ?? "",
    );
    const [vehicleType, setVehicleType] = useState(
        initialData?.vehicleType ?? "",
    );
    const [vehicleMaker, setVehicleMaker] = useState(
        initialData?.vehicleMaker ?? "",
    );
    const [targetEfficiency, setTargetEfficiency] = useState(
        initialData?.target ? String(initialData.target) : "",
    );
    const [initOdometer, setInitOdometer] = useState(
        initialData?.initOdometer ? String(initialData.initOdometer) : "",
    );
    const [vehicleModel, setVehicleModel] = useState(
        initialData?.vehicleModel ?? "",
    );
    const [selectedYear, setSelectedYear] = useState(
        initialData?.year ? String(initialData.year) : "",
    );
    const [status, setStatus] = useState(initialData?.status ?? "");
    const [saving, setSaving] = useState(false);

    // Used to help identify if all required fields are filled
    const allFieldsFilled =
        plateNumber &&
        vehicleType &&
        vehicleMaker &&
        targetEfficiency &&
        initOdometer &&
        vehicleModel &&
        selectedYear &&
        Number(targetEfficiency) > 0 &&
        Number(initOdometer) > 0;

    // Used to help check if target efficiency & odometer values are valid
    const isTargetEffInvalid =
        targetEfficiency && Number(targetEfficiency) <= 0;
    const isInitOdometerInvalid = initOdometer && Number(initOdometer) <= 0;

    // Ensures inputs aren't saved when form closes
    function handleClose() {
        setPlateNumber("");
        setVehicleType("");
        setVehicleMaker("");
        setTargetEfficiency("");
        setInitOdometer("");
        setVehicleModel("");
        setSelectedYear("");
        setStatus("");
        onClose();
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({
                plateNumber,
                vehicleType,
                target: Number(targetEfficiency),
                vehicleMaker,
                vehicleModel,
                initOdometer: Number(initOdometer),
                year: Number(selectedYear),
                ...(isEdit && { status }),
            });
        } finally {
            // Closes Modal if saving is successful.
            setSaving(false);
        }
    }

    return (
        // Background Overlay
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => handleClose()}
        >
            {/* Form Modal */}
            <div
                className="relative mt-2 p-8 w-240 bg-card border border-border rounded-lg shadow shadow-muted-foreground"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:bg-secondary 
                        hover:text-foreground dark:hover:text-primary transition"
                    title="Close"
                >
                    <X size={20} />
                </button>

                {/* Header Text */}
                <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        {isEdit ? "Edit vehicle" : "Add new vehicle"}
                    </h2>
                    <p className="-mt-3 text-md text-muted-foreground">
                        {isEdit
                            ? "Update vehicle details."
                            : "Register a new vehicle. Fill in all required details."}
                    </p>
                </div>

                {/* Form Details */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col mt-4 gap-3"
                >
                    <div className="grid grid-cols-3 gap-6 w-full">
                        <div className="flex flex-col w- gap-1">
                            <label className="text-md font-semibold text-foreground">
                                Plate Number{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Car
                                    size={21}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    id="plate-number"
                                    type="text"
                                    placeholder="e.g. ABC1234"
                                    value={plateNumber}
                                    onChange={(e) =>
                                        setPlateNumber(e.target.value)
                                    }
                                    className="bg-background border border-border rounded-lg pl-9 pr-2 py-2 text-sm text-foreground w-full 
                                        focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md font-semibold text-foreground">
                                Vehicle Brand{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Building2
                                    size={19}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    id="vehicle-brand"
                                    type="text"
                                    placeholder="e.g. Toyota"
                                    value={vehicleMaker}
                                    onChange={(e) =>
                                        setVehicleMaker(e.target.value)
                                    }
                                    className="bg-background border border-border rounded-lg pl-9 pr-2 py-2 text-sm text-foreground w-full 
                                        focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md font-semibold text-foreground">
                                Target Efficiency (km/L){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Fuel
                                    size={19}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    id="target-efficiency"
                                    type="number"
                                    min="0"
                                    placeholder="Enter target efficiency"
                                    value={targetEfficiency}
                                    onChange={(e) =>
                                        setTargetEfficiency(e.target.value)
                                    }
                                    className="bg-background border border-border rounded-lg pl-9 pr-2 py-2 text-sm text-foreground w-full 
                                        focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                />
                            </div>
                            {isTargetEffInvalid && (
                                <p className="text-xs text-red-500 mt-0.5">
                                    Target efficiency must be greater than 0
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md font-semibold text-foreground">
                                Vehicle Type{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Car
                                    size={21}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    id="vehicle-type"
                                    type="text"
                                    placeholder="e.g. Van, Motorcycle, Car"
                                    value={vehicleType}
                                    onChange={(e) =>
                                        setVehicleType(e.target.value)
                                    }
                                    className="bg-background border border-border rounded-lg pl-9 pr-2 py-2 text-sm text-foreground w-full 
                                        focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md font-semibold text-foreground">
                                Vehicle Model{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Car
                                    size={21}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    id="vehicle-model"
                                    type="text"
                                    placeholder="e.g. Fortuner"
                                    value={vehicleModel}
                                    onChange={(e) =>
                                        setVehicleModel(e.target.value)
                                    }
                                    className="bg-background border border-border rounded-lg pl-9 pr-2 py-2 text-sm text-foreground w-full 
                                        focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md font-semibold text-foreground">
                                Initial Odometer (L){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Gauge
                                    size={19}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    id="initial-odometer"
                                    type="number"
                                    min="0"
                                    placeholder="Enter distance"
                                    value={initOdometer}
                                    onChange={(e) =>
                                        setInitOdometer(e.target.value)
                                    }
                                    className="bg-background border border-border rounded-lg pl-9 pr-2 py-2 text-sm text-foreground w-full 
                                        focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                />
                            </div>
                            {isInitOdometerInvalid && (
                                <p className="text-xs text-red-500 mt-0.5">
                                    Initial odometer must be greater than 0
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md font-semibold text-foreground">
                                Year <span className="text-red-500">*</span>
                            </label>
                            <FormSelect
                                value={selectedYear}
                                onChange={setSelectedYear}
                                options={Array.from(
                                    {
                                        length:
                                            new Date().getFullYear() - 1991 + 1,
                                    },
                                    (_, i) =>
                                        String(new Date().getFullYear() - i),
                                )}
                                placeholder="Select a year"
                                icon={<Calendar size={19} />}
                            />
                        </div>

                        {isEdit && (
                            <div className="flex flex-col gap-1">
                                <label className="text-md font-semibold text-foreground">
                                    Status{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <FormSelect
                                    value={status}
                                    onChange={setStatus}
                                    options={["ACTIVE", "INACTIVE"]}
                                    placeholder="Select status"
                                    icon={<Activity size={19} />}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex font-semibold justify-end gap-2 mt-3.5">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-1.5 text-md rounded-md border border-border text-foreground hover:bg-secondary dark:hover:text-primary transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!allFieldsFilled || saving}
                            className={`px-5 py-1.5 text-md rounded-md transition duration-350 
                                ${
                                    allFieldsFilled
                                        ? "bg-primary text-primary-foreground hover:bg-secondary"
                                        : "bg-muted-foreground text-background cursor-not-allowed"
                                }
                                ${saving ? "cursor-not-allowed" : ""}
                            `}
                        >
                            {/* Swaps label if 'submit' is clicked or in edit mode*/}
                            {saving
                                ? "Saving..."
                                : isEdit
                                  ? "Save changes"
                                  : "Add vehicle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
