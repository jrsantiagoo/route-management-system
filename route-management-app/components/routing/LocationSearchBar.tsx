"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Stop } from '@/lib/routing/types';
import { MANILA_LOCATIONS } from '@/lib/routing/mockData';
import { GeocodingResult, searchLocation } from '@/lib/routing/geocodingService';

interface AddStopPopoverProps {
  stops: Stop[];
  onAddStop: (stop: Stop) => void;
  onPreview: (stop: Stop | null) => void;
}

type View = 'closed' | 'saved' | 'geo';
type GeoStatus = 'idle' | 'loading' | 'done' | 'error';

function geocodingResultToStop(result: GeocodingResult): Stop {
  return {
    id: `search-${result.id}-${Date.now()}`,
    name: result.name,
    address: result.address,
    lat: result.lat,
    lng: result.lng,
  };
}

export default function AddStopPopover({ stops, onAddStop, onPreview }: AddStopPopoverProps) {
  const [view, setView] = useState<View>('closed');
  const [savedQuery, setSavedQuery] = useState('');
  const [geoQuery, setGeoQuery] = useState('');
  const [geoResults, setGeoResults] = useState<GeocodingResult[]>([]);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [geoError, setGeoError] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const savedInputRef = useRef<HTMLInputElement>(null);
  const geoInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Close on outside click — only active when open
  useEffect(() => {
    if (view === 'closed') return;
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePopover();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus the active input when view changes
  useEffect(() => {
    if (view === 'saved') setTimeout(() => savedInputRef.current?.focus(), 0);
    if (view === 'geo') setTimeout(() => geoInputRef.current?.focus(), 0);
  }, [view]);

  function closePopover() {
    setView('closed');
    setSavedQuery('');
    setGeoQuery('');
    setGeoResults([]);
    setGeoStatus('idle');
    setGeoError('');
    onPreview(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
  }

  // ── Saved locations ──────────────────────────────────────────────────────

  const alreadyAdded = new Set(stops.map((s) => s.id));
  const filteredSaved = MANILA_LOCATIONS.filter((loc) => {
    if (alreadyAdded.has(loc.id)) return false;
    if (!savedQuery.trim()) return true;
    const q = savedQuery.toLowerCase();
    return loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q);
  });

  function handleSelectSaved(loc: Stop) {
    onAddStop(loc);
    closePopover();
  }

  // ── Geo search ────────────────────────────────────────────────────────────

  const runGeoSearch = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setGeoStatus('loading');
    setGeoError('');
    try {
      const found = await searchLocation(q, abortRef.current.signal);
      setGeoResults(found);
      setGeoStatus('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setGeoError('Search failed. Please try again.');
      setGeoStatus('error');
    }
  }, []);

  function handleGeoQueryChange(value: string) {
    setGeoQuery(value);
    onPreview(null);
    if (!value.trim()) {
      setGeoResults([]);
      setGeoStatus('idle');
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runGeoSearch(value.trim()), 600);
  }

  function handleSelectGeo(result: GeocodingResult) {
    onAddStop(geocodingResultToStop(result));
    onPreview(null);
    closePopover();
  }

  function clearGeoQuery() {
    setGeoQuery('');
    setGeoResults([]);
    setGeoStatus('idle');
    onPreview(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
  }

  // ── Shared styles ─────────────────────────────────────────────────────────

  const rowBase: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 10px',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    boxSizing: 'border-box',
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (view === 'closed') {
    return (
      <div ref={containerRef} style={{ padding: '4px 0' }}>
        <button
          onClick={() => setView('saved')}
          style={{
            width: '100%',
            padding: '7px 10px',
            border: '1px dashed #d1d5db',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#6b7280',
            background: '#fafafa',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          <span>+ Add a stop…</span>
          <span style={{ fontSize: '10px', opacity: 0.7 }}>▾</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ padding: '4px 0' }}>
      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {/* ── Saved locations view ── */}
        {view === 'saved' && (
          <>
            {/* Filter input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 8px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span style={{ color: '#9ca3af', fontSize: '12px', flexShrink: 0 }}>🔍</span>
              <input
                ref={savedInputRef}
                type="text"
                value={savedQuery}
                onChange={(e) => setSavedQuery(e.target.value)}
                placeholder="Search saved locations…"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  color: '#111827',
                  background: 'transparent',
                  padding: '2px 0',
                }}
              />
              <button
                onClick={closePopover}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  fontSize: '16px',
                  lineHeight: 1,
                  padding: '0 2px',
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Saved location list — 5 rows visible, scroll for more */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredSaved.length === 0 ? (
                <div style={{ padding: '10px', fontSize: '12px', color: '#9ca3af' }}>
                  {savedQuery.trim()
                    ? 'No matching saved locations.'
                    : 'All saved locations are already added.'}
                </div>
              ) : (
                filteredSaved.map((loc, i) => (
                  <div
                    key={loc.id}
                    style={{
                      borderBottom: i < filteredSaved.length - 1 ? '1px solid #f3f4f6' : 'none',
                    }}
                  >
                    <button
                      onClick={() => handleSelectSaved(loc)}
                      style={{
                        ...rowBase,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '1px',
                        padding: '8px 10px',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'none';
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                        {loc.name}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '240px',
                        }}
                      >
                        {loc.address}
                      </span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer: open geo search */}
            <div style={{ borderTop: '1px solid #f3f4f6' }}>
              <button
                onClick={() => {
                  clearGeoQuery();
                  setView('geo');
                }}
                style={{
                  ...rowBase,
                  padding: '8px 10px',
                  gap: '7px',
                  color: '#2563eb',
                  fontSize: '12px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'none';
                }}
              >
                <span style={{ fontSize: '11px' }}>🔍</span>
                <span>Search for a new location or enter coordinates</span>
              </button>
            </div>
          </>
        )}

        {/* ── Geo search view ── */}
        {view === 'geo' && (
          <>
            {/* Search input with back button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 8px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <button
                onClick={() => setView('saved')}
                aria-label="Back to saved locations"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontSize: '14px',
                  lineHeight: 1,
                  padding: '0 4px 0 0',
                  flexShrink: 0,
                }}
              >
                ←
              </button>
              <span
                style={{
                  color: '#9ca3af',
                  fontSize: '12px',
                  flexShrink: 0,
                  minWidth: '14px',
                  textAlign: 'center',
                }}
              >
                {geoStatus === 'loading' ? '⟳' : '🔍'}
              </span>
              <input
                ref={geoInputRef}
                type="text"
                value={geoQuery}
                onChange={(e) => handleGeoQueryChange(e.target.value)}
                placeholder="Search address or lat, lng…"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  color: '#111827',
                  background: 'transparent',
                  padding: '2px 0',
                }}
              />
              {geoQuery && (
                <button
                  onClick={clearGeoQuery}
                  aria-label="Clear search"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    fontSize: '16px',
                    lineHeight: 1,
                    padding: '0 2px',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Geo results */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {geoStatus === 'idle' && (
                <div style={{ padding: '10px', fontSize: '12px', color: '#9ca3af' }}>
                  Type an address, or paste coordinates (lat, lng)
                </div>
              )}
              {geoStatus === 'loading' && (
                <div style={{ padding: '10px', fontSize: '12px', color: '#6b7280' }}>
                  Searching…
                </div>
              )}
              {geoStatus === 'error' && (
                <div style={{ padding: '10px', fontSize: '12px', color: '#dc2626' }}>
                  {geoError}
                </div>
              )}
              {geoStatus === 'done' && geoResults.length === 0 && (
                <div style={{ padding: '10px', fontSize: '12px', color: '#9ca3af' }}>
                  No results found.
                </div>
              )}
              {geoStatus === 'done' &&
                geoResults.map((result, i) => (
                  <div
                    key={result.id}
                    style={{
                      borderBottom: i < geoResults.length - 1 ? '1px solid #f3f4f6' : 'none',
                    }}
                    onMouseEnter={() => onPreview(geocodingResultToStop(result))}
                    onMouseLeave={() => onPreview(null)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#111827',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {result.name}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            marginTop: '1px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {result.address}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectGeo(result)}
                        style={{
                          flexShrink: 0,
                          padding: '3px 10px',
                          background: '#374151',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
