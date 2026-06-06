"use client";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Stop, RouteSegment } from '@/lib/routing/types';
import { MANILA_LOCATIONS } from '@/lib/routing/mockData';
import { formatDistance, formatDuration } from '@/lib/routing/formatters';
import SortableStopItem from './SortableStopItem';

interface RouteOrderingPanelProps {
  stops: Stop[];
  segments: RouteSegment[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  isEditMode: boolean;
  isLoading: boolean;
  routeError: string | null;
  onReorder: (newStops: Stop[]) => void;
  onRemoveStop: (id: string) => void;
  onAddStop: (stop: Stop) => void;
}

export default function RouteOrderingPanel({
  stops,
  segments,
  totalDistanceKm,
  totalDurationMinutes,
  isEditMode,
  isLoading,
  routeError,
  onReorder,
  onRemoveStop,
  onAddStop,
}: RouteOrderingPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const availableToAdd = MANILA_LOCATIONS.filter(
    (loc) => !stops.some((s) => s.id === loc.id),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = stops.findIndex((s) => s.id === active.id);
    const newIdx = stops.findIndex((s) => s.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    onReorder(arrayMove(stops, oldIdx, newIdx));
  }

  function segmentBefore(stopId: string): RouteSegment | undefined {
    return segments.find((seg) => seg.toId === stopId);
  }

  function getRole(idx: number): 'start' | 'intermediate' | 'end' {
    if (idx === 0) return 'start';
    if (idx === stops.length - 1 && stops.length > 1) return 'end';
    return 'intermediate';
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 9999,
        width: '288px',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
          Route Plan
        </span>
        <span
          style={{
            fontSize: '11px',
            color: isLoading ? '#6b7280' : routeError ? '#ef4444' : '#6b7280',
          }}
        >
          {isLoading
            ? 'Calculating…'
            : routeError
            ? 'Route unavailable'
            : totalDistanceKm > 0
            ? `${formatDistance(totalDistanceKm)} · ${formatDuration(totalDurationMinutes)}`
            : ''}
        </span>
      </div>

      {/* Scrollable stops list */}
      <div style={{ maxHeight: '430px', overflowY: 'auto', padding: '10px 10px 8px' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stops.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {stops.map((stop, idx) => {
              const seg = idx > 0 ? segmentBefore(stop.id) : undefined;
              return (
                <SortableStopItem
                  key={stop.id}
                  stop={stop}
                  role={getRole(idx)}
                  stopNumber={idx}
                  isEditMode={isEditMode}
                  onRemove={onRemoveStop}
                  distanceLabel={seg ? formatDistance(seg.distanceKm) : undefined}
                  durationLabel={seg ? formatDuration(seg.durationMinutes) : undefined}
                />
              );
            })}
          </SortableContext>
        </DndContext>

        {/* Add stop dropdown — inserts before the current last stop */}
        {isEditMode && availableToAdd.length > 0 && (
          <div style={{ padding: '4px 0' }}>
            <select
              defaultValue=""
              onChange={(e) => {
                const found = MANILA_LOCATIONS.find((l) => l.id === e.target.value);
                if (found) {
                  onAddStop(found);
                  e.currentTarget.value = '';
                }
              }}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px dashed #d1d5db',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#6b7280',
                background: '#fafafa',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>
                + Add a stop…
              </option>
              {availableToAdd.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error footer */}
      {routeError && (
        <div
          style={{
            padding: '7px 14px',
            borderTop: '1px solid #fee2e2',
            background: '#fff7f7',
            fontSize: '11px',
            color: '#dc2626',
            borderRadius: '0 0 6px 6px',
          }}
        >
          Could not reach OSRM. Showing stops only.
        </div>
      )}
    </div>
  );
}
