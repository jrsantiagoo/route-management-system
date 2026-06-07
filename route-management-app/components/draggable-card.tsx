"use client";

import { useDraggable } from "@dnd-kit/core";
import RouteCard from "@/components/route-card";

interface DraggableCardProps {
    route: string;
}

export default function DraggableCard({ route }: DraggableCardProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: route,
    });

    const style = { opacity: isDragging ? 0 : 1 };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <RouteCard route={route} />
        </div>
    );
}
