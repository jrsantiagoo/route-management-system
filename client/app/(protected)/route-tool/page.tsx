"use client";

import { useState, useEffect, useCallback } from "react";
import { RoutePlan } from "@/lib/routing/types";
import {
    loadSavedRoutes,
    deleteRoute,
    setRouteArchived,
} from "@/lib/routing/storageHelper";
import { useTheme } from "@/lib/theme-context";
import { DARK } from "@/components/routing/routeTheme";
import CreateRouteModal from "@/components/routing/CreateRouteModal";
import SavedRoutesTable from "@/components/routing/SavedRoutesTable";
import ConfirmDialog from "@/components/routing/ConfirmDialog";
import Toast from "@/components/routing/Toast";

export default function RouteCreationPage() {
    const { theme } = useTheme();
    const dark = theme === "dark";

    const [savedRoutes, setSavedRoutes] = useState<RoutePlan[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<RoutePlan | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<RoutePlan | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const reload = useCallback(() => {
        setSavedRoutes(loadSavedRoutes());
    }, []);

    // Read localStorage after mount so the server and first client render match.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        reload();
    }, [reload]);

    function openCreate() {
        setEditingRoute(null);
        setIsModalOpen(true);
    }

    function openEdit(route: RoutePlan) {
        setEditingRoute(route);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingRoute(null);
    }

    function handleSaved() {
        const wasEditing = !!editingRoute;
        reload();
        closeModal();
        setToast(
            wasEditing
                ? "Route updated successfully."
                : "Successfully Created Route",
        );
    }

    function handleArchive(route: RoutePlan) {
        setRouteArchived(route.id, true);
        reload();
        setToast("Route archived.");
    }

    function handleUnarchive(route: RoutePlan) {
        setRouteArchived(route.id, false);
        reload();
        setToast("Route restored.");
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        deleteRoute(deleteTarget.id);
        setDeleteTarget(null);
        reload();
        setToast("Route deleted.");
    }

    // Names of other routes — lets an edited route keep its own name.
    const existingNames = savedRoutes
        .filter((r) => r.id !== editingRoute?.id)
        .map((r) => r.name);

    const text = dark ? DARK.text : "#111827";
    const muted = dark ? DARK.textMuted : "#6b7280";
    const border = dark ? DARK.panelBorder : "#d1d5db";

    return (
        <div style={{ width: "100%" }}>
            {/* Page header */}
            <div style={{ marginBottom: "20px" }}>
                <h1
                    style={{
                        margin: 0,
                        fontSize: "26px",
                        fontWeight: 700,
                        color: text,
                    }}
                >
                    Route Creation
                </h1>
                <p
                    style={{
                        margin: "6px 0 0",
                        fontSize: "14px",
                        color: muted,
                    }}
                >
                    Create and manage delivery routes across your fleet.
                </p>
            </div>

            {/* Actions row */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    gap: "12px",
                }}
            >
                <button
                    onClick={openCreate}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 18px",
                        background: dark ? DARK.btnBg : "#fff",
                        color: dark ? DARK.btnText : "#374151",
                        border: `1px solid ${border}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Create New Route
                </button>

                <button
                    onClick={reload}
                    title="Refresh"
                    aria-label="Refresh saved routes"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: `1px solid ${border}`,
                        background: dark ? DARK.btnBg : "#fff",
                        color: muted,
                        cursor: "pointer",
                    }}
                >
                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3L3 16" />
                        <path d="M3 21v-5h5" />
                    </svg>
                </button>
            </div>

            <SavedRoutesTable
                routes={savedRoutes}
                onEdit={openEdit}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
                onDelete={(route) => setDeleteTarget(route)}
            />

            {isModalOpen && (
                <CreateRouteModal
                    editingRoute={editingRoute}
                    existingNames={existingNames}
                    onClose={closeModal}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <ConfirmDialog
                    title="Delete route?"
                    message={`“${deleteTarget.name}” will be permanently removed. This cannot be undone.`}
                    confirmLabel="Delete"
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {toast && (
                <Toast message={toast} onDismiss={() => setToast(null)} />
            )}
        </div>
    );
}
