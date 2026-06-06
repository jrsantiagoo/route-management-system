"use client";
// This file is loaded ONLY on the client (via dynamic import with ssr:false in RouteMap.tsx).
// Leaflet cannot run on the server – never remove the dynamic import wrapper.
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Stop } from '@/lib/routing/types';

// Fix broken default marker icons when bundled by webpack / Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createStopIcon(label: string, color: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="background:${color};color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${label}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

/** Automatically fits the map to the current stop bounds when stops change. */
function FitBoundsController({ stops }: { stops: Stop[] }) {
  const map = useMap();
  const prevKey = useRef('');

  useEffect(() => {
    const key = stops.map((s) => s.id).join(',');
    if (key === prevKey.current) return;
    prevKey.current = key;

    if (stops.length >= 2) {
      const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [80, 80] });
    } else if (stops.length === 1) {
      map.setView([stops[0].lat, stops[0].lng], 14);
    }
  }, [stops, map]);

  return null;
}

interface RouteMapInnerProps {
  stops: Stop[];
  polyline: [number, number][];
}

export default function RouteMapInner({ stops, polyline }: RouteMapInnerProps) {
  return (
    <MapContainer
      center={[14.5832, 120.9794]} // Metro Manila default
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {stops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;
        const color = isFirst ? '#22c55e' : isLast ? '#ef4444' : '#3b82f6';
        const label = isFirst ? 'S' : isLast ? 'E' : String(index);
        return (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={createStopIcon(label, color)}
          >
            <Popup>
              <strong>{stop.name}</strong>
              <br />
              <small style={{ color: '#6b7280' }}>{stop.address}</small>
            </Popup>
          </Marker>
        );
      })}

      {polyline.length > 1 && (
        <Polyline
          positions={polyline}
          pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.8 }}
        />
      )}

      <FitBoundsController stops={stops} />
    </MapContainer>
  );
}
