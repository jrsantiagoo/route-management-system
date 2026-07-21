"use client";

import {
    Building2,
    Calendar,
    Car,
    CirclePlus,
    Fuel,
    Gauge,
} from "lucide-react";
import { useState } from "react";
import FormSelect from "../ui/form-select";

export default function VehicleForm() {
    const [open, setOpen] = useState(false);
    const [plateNumber, setPlateNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleMaker, setVehicleMaker] = useState("");
    const [targetEfficiency, setTargetEfficiency] = useState("");
    const [initOdometer, setInitOdometer] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [year, setYear] = useState("");

    function handleCancel() {
        setOpen(false);
    }

    return (
        <div>
            {/* Enables Vehicle Creation */}
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center -mt-2 gap-2 px-4.5 py-1.5 text-sm font-semibold rounded-lg border border-border bg-card 
                    text-foreground hover:bg-secondary dark:hover:text-primary transition duration-300"
            >
                <CirclePlus size={16} />
                Add Vehicle
            </button>

            {open && (
                // Background Overlay
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="mt-2 p-8 w-240 bg-card border border-border rounded-md shadow shadow-muted-foreground"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Text */}
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground mb-3">
                                Add new vehicle
                            </h2>
                            <p className="-mt-3 text-md text-muted-foreground">
                                Register a new vehicle. Fill in all required
                                details.
                            </p>
                        </div>

                        {/* Form Details */}
                        <form
                            // onSubmit=""
                            className="flex flex-col mt-4 gap-3"
                        >
                            <div className="grid grid-cols-3 gap-6 w-full">
                                <div className="flex flex-col w- gap-1">
                                    <label className="text-md font-semibold text-foreground">
                                        Plate Number
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
                                        ></input>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-md font-semibold text-foreground">
                                        Vehicle Brand
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
                                        ></input>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-md font-semibold text-foreground">
                                        Target Efficiency (km/L)
                                    </label>
                                    <div className="relative">
                                        <Fuel
                                            size={19}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        />
                                        <input
                                            id="target-efficiency"
                                            type="number"
                                            placeholder="Enter target efficiency"
                                            value={targetEfficiency}
                                            onChange={(e) =>
                                                setTargetEfficiency(
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-background border border-border rounded-lg pl-9 pr-2 py-2 text-sm text-foreground w-full 
                                                focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                        ></input>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-md font-semibold text-foreground">
                                        Vehicle Type
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
                                        ></input>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-md font-semibold text-foreground">
                                        Vehicle Model
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
                                        ></input>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-md font-semibold text-foreground">
                                        Initial Odometer (L)
                                    </label>
                                    <div className="relative">
                                        <Gauge
                                            size={19}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        />
                                        <input
                                            id="initial-odometer"
                                            type="number"
                                            placeholder="Enter distance"
                                            value={initOdometer}
                                            onChange={(e) =>
                                                setInitOdometer(e.target.value)
                                            }
                                            className="bg-background border border-border rounded-lg pl-9 pr-2 py-2 text-sm text-foreground w-full 
                                                focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                                        ></input>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-md font-semibold text-foreground">
                                        Year
                                    </label>
                                    <FormSelect
                                        value={year}
                                        onChange={setYear}
                                        options={Array.from(
                                            {
                                                length:
                                                    new Date().getFullYear() -
                                                    1991 +
                                                    1,
                                            },
                                            (_, i) =>
                                                String(
                                                    new Date().getFullYear() -
                                                        i,
                                                ),
                                        )}
                                        placeholder="Select a Year"
                                        icon={
                                            <Calendar
                                                size={19}
                                                className="text-muted-foreground"
                                            />
                                        }
                                    />
                                </div>
                            </div>

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
                                    className="px-5 py-1.5 text-md rounded-md bg-primary text-primary-foreground hover:bg-secondary transition"
                                >
                                    Add vehicle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
