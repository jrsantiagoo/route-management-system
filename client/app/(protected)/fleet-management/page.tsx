"use client";

import { useState } from "react";
import FleetTable from "@/components/fleet-management/fleet-table";
import VehicleForm from "@/components/fleet-management/vehicle-form";
import VehicleFormModal from "@/components/fleet-management/vehicle-form-modal";
import { mockVehicleData } from "@/lib/fleet-management/mockData";
import type { Vehicle } from "@/lib/fleet-management/mockData";

export default function FleetManagement() {
    const [editTarget, setEditTarget] = useState<Vehicle | null>(null);

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold">Fleet Management</h1>
                    <p className="text-md text-muted-foreground">
                        Manage your fleet vehicles
                    </p>
                </div>
            </div>

            <VehicleForm />
            <FleetTable vehicles={mockVehicleData} onEdit={setEditTarget} />

            {editTarget && (
                <VehicleFormModal
                    initialData={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={() => setEditTarget(null)}
                />
            )}
        </div>
    );
}
