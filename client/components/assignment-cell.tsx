"use client";

import { useDroppable } from "@dnd-kit/core";
import RouteCard from "@/components/route-card";

type Assignment = {
    tripId: string;
    routeName: string;
};

interface CellProps {
    id: string;
    routes: Assignment[];
    onDelete: (cellId: string, index: number) => void;
}

// Acts as target cell for card drops
export default function AssignmentCell({ id, routes, onDelete }: CellProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`border border-gray-200 p-2 ${isOver ? "bg-blue-100" : ""}`}
        >
            {routes.map((assignment, index) => (
                <RouteCard
                    key={`${assignment.tripId}-${index}`}
                    route={assignment.routeName}
                    onDelete={() => onDelete(id, index)}
                />
            ))}
        </div>
    );
}
