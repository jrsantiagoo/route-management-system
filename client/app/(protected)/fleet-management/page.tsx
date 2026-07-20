"use client";

import FleetTable from "@/components/fleet-management/fleet-table";
import { mockVehicleData } from "@/lib/fleet-management/mockData";

export default function FleetManagement() {
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

            <FleetTable vehicles={mockVehicleData} />
        </div>
    );
}
