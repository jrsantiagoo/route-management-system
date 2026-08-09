"use client";

import { useState, useCallback } from "react";
import FleetTable from "@/components/fleet-management/fleet-table";
import VehicleForm from "@/components/fleet-management/vehicle-form";
import VehicleFormModal from "@/components/fleet-management/vehicle-form-modal";
import VehicleDetailsModal from "@/components/fleet-management/vehicle-details";
import Toast from "@/components/ui/toast";
import type { Vehicle } from "@/lib/types/vehicle";
import * as vehicleApi from "@/lib/api/vehicles";

export default function FleetManagement() {
    const [vehicles, setVehicles] = useState<Vehicle[]>();
    const [editTarget, setEditTarget] = useState<Vehicle | null>(null);
    const [viewTarget, setViewTarget] = useState<Vehicle | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [archivedIds, setArchivedIds] = useState<string[]>([]);

    // Move a vehicle to the archived list
    const handleArchive = useCallback((vehicle: Vehicle) => {
        setVehicles((prev) =>
            prev.map((v) =>
                v.vehicleId_ === vehicle.vehicleId_
                    ? { ...v, archivedAt: new Date().toISOString() }
                    : v,
            ),
        );
        setArchivedIds((prev) => [...prev, vehicle.vehicleId_]);
        setToast("Vehicle archived.");
    }, []);

    // Restore a vehicle from the archived list
    const handleUnarchive = useCallback((vehicle: Vehicle) => {
        setVehicles((prev) =>
            prev.map((v) =>
                v.vehicleId_ === vehicle.vehicleId_
                    ? { ...v, archivedAt: undefined }
                    : v,
            ),
        );
        setArchivedIds((prev) =>
            prev.filter((id) => id !== vehicle.vehicleId_),
        );
        setToast("Vehicle unarchived.");
    }, []);

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

            <VehicleForm
                onSaved={() => setToast("Vehicle added successfully.")}
            />
            <FleetTable
                vehicles={vehicles}
                archivedIds={archivedIds}
                onEdit={setEditTarget}
                onView={setViewTarget}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
            />

            {editTarget && (
                <VehicleFormModal
                    initialData={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={() => {
                        setEditTarget(null);
                        setToast("Vehicle updated successfully.");
                    }}
                />
            )}

            {viewTarget && (
                <VehicleDetailsModal
                    initialData={viewTarget}
                    onClose={() => setViewTarget(null)}
                />
            )}

            {toast && (
                <Toast
                    message={toast}
                    position="bottom-right"
                    onDismiss={() => setToast(null)}
                />
            )}
        </div>
    );
}
