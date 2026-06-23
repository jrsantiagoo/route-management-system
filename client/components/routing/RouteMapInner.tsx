"use client";
// This file is loaded ONLY on the client (via dynamic import with ssr:false in RouteMap.tsx).
// Leaflet cannot run on the server – never remove the dynamic import wrapper.
import { useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Stop } from "@/lib/routing/types";
import { useTheme } from "@/lib/theme-context";

// Fix broken default marker icons when bundled by webpack / Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
    ._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Muted, low-clutter CARTO basemaps – both are free and need no API key.
// Light = Positron, Dark = Dark Matter. The map follows the app theme toggle.
const BASEMAPS = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
} as const;

const CARTO_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>';

// Route line styling. The blue line sits on top of a wider white casing so it
// stays readable over roads and labels on either basemap.
const ROUTE_COLOR = "#2563eb";
const ROUTE_CASING = "#ffffff";
const ROUTE_WEIGHT = 6;
const ROUTE_CASING_WEIGHT = 10;

// Stop marker colors – start and end stay visually distinct from the middle stops.
const START_COLOR = "#22c55e";
const END_COLOR = "#ef4444";
const MID_COLOR = ROUTE_COLOR;
const PREVIEW_COLOR = "#f97316";

function createStopIcon(label: string, color: string): L.DivIcon {
    return L.divIcon({
        html: `<div style="background:${color};color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;line-height:1;font-family:inherit;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35);box-sizing:border-box">${label}</div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15], // circular markers are centered on the coordinate
        popupAnchor: [0, -18],
    });
}

/**
 * Fits the map to the full route. Prefers the OSRM polyline geometry (which
 * extends beyond the raw stop coordinates) and falls back to the stops while
 * the route is still being calculated. Extra left padding keeps the route clear
 * of the route-ordering panel (288px wide, pinned top-left).
 */
function FitBoundsController({
    stops,
    polyline,
}: {
    stops: Stop[];
    polyline: [number, number][];
}) {
    const map = useMap();
    const prevKey = useRef("");

    useEffect(() => {
        const key = `${stops.map((s) => s.id).join(",")}|${polyline.length}`;
        if (key === prevKey.current) return;
        prevKey.current = key;

        const points: [number, number][] =
            polyline.length > 1
                ? polyline
                : stops.map((s) => [s.lat, s.lng] as [number, number]);

        if (points.length >= 2) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, {
                // [x, y] – wide left gutter clears the ordering panel.
                paddingTopLeft: [330, 60],
                paddingBottomRight: [60, 60],
            });
        } else if (points.length === 1) {
            map.setView(points[0], 14);
        }
    }, [stops, polyline, map]);

    return null;
}

interface RouteMapInnerProps {
    stops: Stop[];
    polyline: [number, number][];
    previewStop?: Stop | null;
}

export default function RouteMapInner({
    stops,
    polyline,
    previewStop,
}: RouteMapInnerProps) {
    const { theme } = useTheme();

    return (
        <MapContainer
            className="route-map"
            center={[14.5832, 120.9794]} // Metro Manila default
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
        >
            <TileLayer
                // key forces a clean remount when the theme toggles so the
                // basemap swaps between Positron and Dark Matter.
                key={theme}
                attribution={CARTO_ATTRIBUTION}
                url={BASEMAPS[theme]}
                subdomains="abcd"
                maxZoom={20}
            />

            {/* Route line: white casing underneath, blue line on top, rounded caps/joins. */}
            {polyline.length > 1 && (
                <>
                    <Polyline
                        positions={polyline}
                        pathOptions={{
                            color: ROUTE_CASING,
                            weight: ROUTE_CASING_WEIGHT,
                            opacity: 1,
                            lineCap: "round",
                            lineJoin: "round",
                        }}
                    />
                    <Polyline
                        positions={polyline}
                        pathOptions={{
                            color: ROUTE_COLOR,
                            weight: ROUTE_WEIGHT,
                            opacity: 1,
                            lineCap: "round",
                            lineJoin: "round",
                        }}
                    />
                </>
            )}

            {stops.map((stop, index) => {
                const isFirst = index === 0;
                const isLast = index === stops.length - 1;
                const color = isFirst
                    ? START_COLOR
                    : isLast
                      ? END_COLOR
                      : MID_COLOR;
                const label = String(index + 1);
                return (
                    <Marker
                        key={stop.id}
                        position={[stop.lat, stop.lng]}
                        icon={createStopIcon(label, color)}
                    >
                        <Popup>
                            <strong>{stop.name}</strong>
                            <br />
                            <small style={{ color: "#6b7280" }}>
                                {stop.address}
                            </small>
                        </Popup>
                    </Marker>
                );
            })}

            {previewStop && (
                <Marker
                    position={[previewStop.lat, previewStop.lng]}
                    icon={createStopIcon("?", PREVIEW_COLOR)}
                >
                    <Popup>
                        <strong>{previewStop.name}</strong>
                        <br />
                        <small style={{ color: "#6b7280" }}>
                            {previewStop.address}
                        </small>
                    </Popup>
                </Marker>
            )}

            <FitBoundsController stops={stops} polyline={polyline} />
        </MapContainer>
    );
}
