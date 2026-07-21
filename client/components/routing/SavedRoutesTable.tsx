"use client";

import { useState, useMemo } from "react";
import { RoutePlan } from "@/lib/routing/types";
import { formatDateTime } from "@/lib/routing/formatters";
import {
    getRouteAreaTags,
    formatOrderLabel,
} from "@/lib/routing/orderData";
import { useTheme } from "@/lib/theme-context";
import { DARK } from "./routeTheme";

interface SavedRoutesTableProps {
    routes: RoutePlan[];
    onEdit: (route: RoutePlan) => void;
    onArchive: (route: RoutePlan) => void;
    onUnarchive: (route: RoutePlan) => void;
    onDelete: (route: RoutePlan) => void;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20];

function stopsSummary(route: RoutePlan): string {
    const labels = route.stops.map((_, i) => `Stop ${i + 1}`);
    const shown = labels.slice(0, 4).join(" - ");
    return labels.length > 4 ? `${shown} - …` : shown || "No stops";
}

function stopDisplay(stop: RoutePlan["stops"][number]): string {
    return stop.orderIds && stop.orderIds.length > 0
        ? formatOrderLabel(stop.orderIds)
        : stop.name;
}

export default function SavedRoutesTable({
    routes,
    onEdit,
    onArchive,
    onUnarchive,
    onDelete,
}: SavedRoutesTableProps) {
    const { theme } = useTheme();
    const dark = theme === "dark";

    const [view, setView] = useState<"active" | "archived">("active");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const inView = routes.filter((r) =>
            view === "archived" ? r.archived : !r.archived,
        );
        const q = query.trim().toLowerCase();
        if (!q) return inView;
        return inView.filter((r) => {
            const areas = getRouteAreaTags(r).join(" ").toLowerCase();
            return (
                r.name.toLowerCase().includes(q) || areas.includes(q)
            );
        });
    }, [routes, view, query]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * rowsPerPage;
    const pageRows = filtered.slice(startIdx, startIdx + rowsPerPage);
    const showingFrom = filtered.length === 0 ? 0 : startIdx + 1;
    const showingTo = Math.min(startIdx + rowsPerPage, filtered.length);

    const border = dark ? DARK.panelBorder : "#e5e7eb";
    const muted = dark ? DARK.textMuted : "#6b7280";
    const text = dark ? DARK.text : "#111827";

    const thStyle: React.CSSProperties = {
        textAlign: "left",
        padding: "12px 16px",
        fontSize: "12px",
        fontWeight: 700,
        color: text,
        whiteSpace: "nowrap",
    };
    const tdStyle: React.CSSProperties = {
        padding: "14px 16px",
        fontSize: "13px",
        color: text,
        verticalAlign: "middle",
    };

    return (
        <section
            style={{
                background: dark ? DARK.panelBg : "#fff",
                border: `1px solid ${border}`,
                borderRadius: "12px",
                padding: "20px 22px",
            }}
        >
            {/* Header row */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: 700,
                            color: text,
                        }}
                    >
                        Saved Routes
                    </h2>
                    <p
                        style={{
                            margin: "4px 0 0",
                            fontSize: "13px",
                            color: muted,
                        }}
                    >
                        View, review, archive, or delete previously created
                        routes.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    {/* Active / Archived toggle */}
                    <div
                        style={{
                            display: "inline-flex",
                            border: `1px solid ${border}`,
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        {(["active", "archived"] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => {
                                    setView(v);
                                    setPage(1);
                                    setExpandedId(null);
                                }}
                                style={{
                                    padding: "7px 14px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    textTransform: "capitalize",
                                    border: "none",
                                    cursor: "pointer",
                                    background:
                                        view === v
                                            ? dark
                                                ? DARK.btnActiveBg
                                                : "#1e293b"
                                            : "transparent",
                                    color:
                                        view === v
                                            ? dark
                                                ? DARK.btnText
                                                : "#fff"
                                            : muted,
                                }}
                            >
                                {v}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            border: `1px solid ${border}`,
                            borderRadius: "9999px",
                            background: dark ? DARK.elevatedBg : "#fff",
                            minWidth: "240px",
                        }}
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={muted}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search Route Name or Area/s…"
                            style={{
                                border: "none",
                                outline: "none",
                                background: "transparent",
                                fontSize: "13px",
                                color: text,
                                flex: 1,
                                minWidth: 0,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth: "760px",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                background: dark ? DARK.elevatedBg : "#f9fafb",
                                borderTop: `1px solid ${border}`,
                                borderBottom: `1px solid ${border}`,
                            }}
                        >
                            <th style={thStyle}>Route Name</th>
                            <th style={thStyle}>Stops</th>
                            <th style={thStyle}>Tags</th>
                            <th style={thStyle}>Date Created</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    style={{
                                        ...tdStyle,
                                        textAlign: "center",
                                        color: muted,
                                        padding: "40px 16px",
                                    }}
                                >
                                    {query.trim()
                                        ? "No routes match your search."
                                        : view === "archived"
                                          ? "No archived routes."
                                          : "No saved routes yet. Click “Create New Route” to add one."}
                                </td>
                            </tr>
                        ) : (
                            pageRows.map((route) => {
                                const areaTags = getRouteAreaTags(route);
                                const vehicleTag =
                                    route.vehicleType === "car"
                                        ? "Car"
                                        : "Motor";
                                const expanded = expandedId === route.id;
                                return (
                                    <RouteRow
                                        key={route.id}
                                        route={route}
                                        expanded={expanded}
                                        onToggleExpand={() =>
                                            setExpandedId(
                                                expanded ? null : route.id,
                                            )
                                        }
                                        vehicleTag={vehicleTag}
                                        areaTags={areaTags}
                                        dark={dark}
                                        view={view}
                                        onEdit={() => onEdit(route)}
                                        onArchive={() => onArchive(route)}
                                        onUnarchive={() => onUnarchive(route)}
                                        onDelete={() => onDelete(route)}
                                        tdStyle={tdStyle}
                                        border={border}
                                        muted={muted}
                                        text={text}
                                    />
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: muted,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <span>Rows per page</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        style={{
                            padding: "4px 8px",
                            border: `1px solid ${border}`,
                            borderRadius: "6px",
                            background: dark ? DARK.elevatedBg : "#fff",
                            color: text,
                            fontSize: "13px",
                            cursor: "pointer",
                        }}
                    >
                        {ROWS_PER_PAGE_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <span>
                        | Showing {showingFrom}-{showingTo} of {filtered.length}
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <PagerButton
                        dark={dark}
                        border={border}
                        muted={muted}
                        disabled={currentPage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        dir="prev"
                    />
                    <span style={{ color: text }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <PagerButton
                        dark={dark}
                        border={border}
                        muted={muted}
                        disabled={currentPage >= totalPages}
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        dir="next"
                    />
                </div>
            </div>
        </section>
    );
}

// ── Row ─────────────────────────────────────────────────────────────────────

interface RouteRowProps {
    route: RoutePlan;
    expanded: boolean;
    onToggleExpand: () => void;
    vehicleTag: string;
    areaTags: string[];
    dark: boolean;
    view: "active" | "archived";
    onEdit: () => void;
    onArchive: () => void;
    onUnarchive: () => void;
    onDelete: () => void;
    tdStyle: React.CSSProperties;
    border: string;
    muted: string;
    text: string;
}

function RouteRow({
    route,
    expanded,
    onToggleExpand,
    vehicleTag,
    areaTags,
    dark,
    view,
    onEdit,
    onArchive,
    onUnarchive,
    onDelete,
    tdStyle,
    border,
    muted,
    text,
}: RouteRowProps) {
    return (
        <>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{route.name}</td>
                <td style={tdStyle}>
                    <button
                        onClick={onToggleExpand}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: text,
                            fontSize: "13px",
                            padding: 0,
                        }}
                        aria-expanded={expanded}
                        title="Show all stops"
                    >
                        <span>{stopsSummary(route)}</span>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={muted}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                transform: expanded
                                    ? "rotate(180deg)"
                                    : "none",
                                transition: "transform 0.15s",
                                flexShrink: 0,
                            }}
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                </td>
                <td style={tdStyle}>
                    <div
                        style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                        }}
                    >
                        <Tag label={vehicleTag} kind="vehicle" dark={dark} />
                        {areaTags.map((a, i) => (
                            <Tag
                                key={a}
                                label={a}
                                kind={i % 2 === 0 ? "area1" : "area2"}
                                dark={dark}
                            />
                        ))}
                    </div>
                </td>
                <td style={{ ...tdStyle, color: muted, whiteSpace: "nowrap" }}>
                    {formatDateTime(route.createdAt)}
                </td>
                <td style={tdStyle}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "6px",
                        }}
                    >
                        <IconButton
                            title="Edit route"
                            onClick={onEdit}
                            dark={dark}
                            border={border}
                            muted={muted}
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </IconButton>
                        {view === "archived" ? (
                            <IconButton
                                title="Unarchive route"
                                onClick={onUnarchive}
                                dark={dark}
                                border={border}
                                muted={muted}
                            >
                                <path d="M3 3v5h5" />
                                <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                            </IconButton>
                        ) : (
                            <IconButton
                                title="Archive route"
                                onClick={onArchive}
                                dark={dark}
                                border={border}
                                muted={muted}
                            >
                                <rect
                                    x="2"
                                    y="4"
                                    width="20"
                                    height="5"
                                    rx="1"
                                />
                                <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                                <path d="M10 13h4" />
                            </IconButton>
                        )}
                        <IconButton
                            title="Delete route"
                            onClick={onDelete}
                            dark={dark}
                            border={border}
                            muted={muted}
                            danger
                        >
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </IconButton>
                    </div>
                </td>
            </tr>

            {expanded && (
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                    <td
                        colSpan={5}
                        style={{
                            padding: "0 16px 14px",
                            background: dark ? DARK.elevatedBg : "#f9fafb",
                        }}
                    >
                        <ol
                            style={{
                                margin: "12px 0 0",
                                padding: 0,
                                listStyle: "none",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            {route.stops.map((stop, i) => (
                                <li
                                    key={stop.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "10px",
                                    }}
                                >
                                    <span
                                        style={{
                                            flexShrink: 0,
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            background:
                                                i === 0
                                                    ? "#22c55e"
                                                    : i ===
                                                        route.stops.length - 1
                                                      ? "#ef4444"
                                                      : "#3b82f6",
                                            color: "#fff",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {i === 0
                                            ? "S"
                                            : i === route.stops.length - 1
                                              ? "E"
                                              : i}
                                    </span>
                                    <div style={{ minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                color: text,
                                            }}
                                        >
                                            {stopDisplay(stop)}
                                        </div>
                                        {stop.address && (
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: muted,
                                                }}
                                            >
                                                {stop.address}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </td>
                </tr>
            )}
        </>
    );
}

// ── Small presentational helpers ────────────────────────────────────────────

function Tag({
    label,
    kind,
    dark,
}: {
    label: string;
    kind: "vehicle" | "area1" | "area2";
    dark: boolean;
}) {
    const palette = {
        vehicle: dark
            ? { bg: "rgba(148,163,184,0.15)", fg: "#cbd5e1", bd: "rgba(148,163,184,0.35)" }
            : { bg: "#f1f5f9", fg: "#475569", bd: "#e2e8f0" },
        area1: dark
            ? { bg: "rgba(59,130,246,0.15)", fg: "#93c5fd", bd: "rgba(59,130,246,0.35)" }
            : { bg: "#eff6ff", fg: "#2563eb", bd: "#dbeafe" },
        area2: dark
            ? { bg: "rgba(34,197,94,0.15)", fg: "#86efac", bd: "rgba(34,197,94,0.35)" }
            : { bg: "#f0fdf4", fg: "#16a34a", bd: "#dcfce7" },
    }[kind];

    return (
        <span
            style={{
                fontSize: "11px",
                fontWeight: 600,
                color: palette.fg,
                background: palette.bg,
                border: `1px solid ${palette.bd}`,
                borderRadius: "9999px",
                padding: "2px 10px",
                whiteSpace: "nowrap",
            }}
        >
            {label}
        </span>
    );
}

function IconButton({
    title,
    onClick,
    dark,
    border,
    muted,
    danger = false,
    children,
}: {
    title: string;
    onClick: () => void;
    dark: boolean;
    border: string;
    muted: string;
    danger?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            aria-label={title}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: `1px solid ${border}`,
                background: dark ? DARK.btnBg : "#fff",
                color: danger ? "#dc2626" : muted,
                cursor: "pointer",
            }}
        >
            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {children}
            </svg>
        </button>
    );
}

function PagerButton({
    dark,
    border,
    muted,
    disabled,
    onClick,
    dir,
}: {
    dark: boolean;
    border: string;
    muted: string;
    disabled: boolean;
    onClick: () => void;
    dir: "prev" | "next";
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={dir === "prev" ? "Previous page" : "Next page"}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: `1px solid ${border}`,
                background: dark ? DARK.btnBg : "#fff",
                color: muted,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.4 : 1,
            }}
        >
            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {dir === "prev" ? (
                    <path d="m15 18-6-6 6-6" />
                ) : (
                    <path d="m9 18 6-6-6-6" />
                )}
            </svg>
        </button>
    );
}
