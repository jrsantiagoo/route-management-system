"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import VehicleFormModal from "./vehicle-form-modal";

export default function VehicleForm() {
    const [open, setOpen] = useState(false);

    return (
        <div>
            {/* Enables Vehicle Creation */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center -mt-2 gap-2 px-4.5 py-1.5 text-sm font-semibold rounded-lg border border-border bg-card 
                    text-foreground hover:bg-secondary dark:hover:text-primary transition duration-300"
            >
                <Plus size={16} />
                Add Vehicle
            </button>

            {open && (
                <VehicleFormModal
                    onClose={() => setOpen(false)}
                    onSave={() => setOpen(false)}
                />
            )}
        </div>
    );
}
