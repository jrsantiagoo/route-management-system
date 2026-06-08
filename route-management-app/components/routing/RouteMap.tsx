"use client";
// Dynamic import with ssr:false is required to prevent Leaflet from running on the server.
// Leaflet accesses `window` on module evaluation and will throw during SSR without this.
import dynamic from "next/dynamic";
import { Stop } from "@/lib/routing/types";

const RouteMapInner = dynamic(() => import("./RouteMapInner"), {
    ssr: false,
    loading: () => (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#f3f4f6",
                color: "#9ca3af",
                gap: "8px",
                fontSize: "14px",
            }}
        >
            <span style={{ fontSize: "28px" }}>🗺️</span>
            <span>Loading map…</span>
        </div>
    ),
});

interface RouteMapProps {
    stops: Stop[];
    polyline: [number, number][];
    previewStop?: Stop | null;
}

export default function RouteMap({ stops, polyline }: RouteMapProps) {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <RouteMapInner stops={stops} polyline={polyline} />
        </div>
    );
}
