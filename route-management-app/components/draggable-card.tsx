"use client";

import { useDraggable } from "@dnd-kit/core";
import RouteCard from "@/components/route-card";

interface DraggableCardProps {
    route: string;
}

export default function DraggableRoute({ route }: DraggableCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: route,
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <RouteCard route={route} />
        </div>
    );
}
