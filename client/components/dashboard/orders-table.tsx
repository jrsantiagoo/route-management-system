import { orders } from "@/lib/dashboard/mockData";
import type { Order } from "@/lib/dashboard/mockData";
import {
    CalendarClock,
    ChevronDown,
    MapPinned,
    Package,
    PackageSearch,
    Search,
    User,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSort } from "@/lib/hooks/useSort";
import SortableHeader from "@/components/ui/sortable-header";

interface FilterSelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
}

// Filter Component
function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
    const [open, setOpen] = useState(false);
    const isActive = value !== "All";
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Filter Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`
                    flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs
                    outline-none hover:bg-secondary dark:hover:text-primary transition
                    ${
                        isActive
                            ? "border-primary-foreground bg-primary dark:bg-primary-foreground/40 text-foreground"
                            : "border-gray-300 text-foreground dark:bg-card"
                    }
                `}
            >
                <span>{value === "All" ? label : value}</span>
                <ChevronDown
                    size={14}
                    className={`transition ${open ? "rotate-180" : ""} ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                />
            </button>

            {/* Collapsable Dropdown Options */}
            {open && (
                <div
                    className="absolute left-0 top-full z-10 mt-1 flex w-max min-w-full flex-col rounded-lg border border-border 
                        bg-card shadow shadow-muted-foreground"
                >
                    <button
                        onClick={() => {
                            onChange("All");
                            setOpen(false);
                        }}
                        className="rounded-t-lg px-3 py-1.5 text-left text-xs transition hover:bg-secondary dark:hover:text-primary"
                    >
                        {label}
                    </button>
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={`
                                px-3 py-1.5 text-left text-xs transition hover:bg-secondary dark:hover:text-primary
                                last:rounded-b-lg
                                ${value === opt ? "bg-primary dark:bg-primary-foreground/35 text-foreground" : ""}
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Orders Table Component with search functionality
export default function OrdersTable() {
    const [search, setSearch] = useState("");
    const [clientFilter, setClientFilter] = useState("All");
    const [destinationFilter, setDestinationFilter] = useState("All");
    const [contentFilter, setContentFilter] = useState("All");

    const clients = [...new Set(orders.map((o) => o.client))];
    const destinations = [...new Set(orders.map((o) => o.destination))];
    const contents = [...new Set(orders.map((o) => o.packageContent))];

    const filtered = orders.filter((o) => {
        const matchesSearch =
            search === "" ||
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.client.toLowerCase().includes(search.toLowerCase()) ||
            o.destination.toLowerCase().includes(search.toLowerCase()) ||
            o.packageContent.toLowerCase().includes(search.toLowerCase());

        const matchesClient =
            clientFilter === "All" || o.client === clientFilter;
        const matchesDestination =
            destinationFilter === "All" || o.destination === destinationFilter;
        const matchesContent =
            contentFilter === "All" || o.packageContent === contentFilter;

        return (
            matchesSearch &&
            matchesClient &&
            matchesDestination &&
            matchesContent
        );
    });

    // Sort orders by the currently active column
    const getOrderVal = useCallback((o: Order, key: string) => {
        switch (key) {
            case "id":
                return o.id;
            case "client":
                return o.client;
            case "destination":
                return o.destination;
            case "orderedOn":
                return o.orderedOn;
            case "deliverBy":
                return o.deliverBy;
            case "packageContent":
                return o.packageContent;
            case "packageSize":
                return o.packageSize;
            case "packageWeight":
                return o.packageWeight;
            default:
                return "";
        }
    }, []);
    const {
        sorted: sortedOrders,
        state: sortState,
        toggle: toggleSort,
    } = useSort(filtered, getOrderVal);

    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            {/* Header + search */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">
                    Orders
                </h3>
                <div className="relative">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        type="text"
                        placeholder="Search orders…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 rounded-lg border border-gray-300 pl-8 pr-4 py-1.5 text-sm text-foreground 
                        outline-none transition focus:border-primary-foreground dark:bg-card placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Filter Options */}
            <div className="-mt-4 mb-3 flex flex-wrap gap-2">
                <FilterSelect
                    label="All Clients"
                    value={clientFilter}
                    options={clients}
                    onChange={setClientFilter}
                />
                <FilterSelect
                    label="All Destinations"
                    value={destinationFilter}
                    options={destinations}
                    onChange={setDestinationFilter}
                />
                <FilterSelect
                    label="All Contents"
                    value={contentFilter}
                    options={contents}
                    onChange={setContentFilter}
                />
            </div>

            {/* Scrollable table */}
            <div className="overflow-auto max-h-96 rounded-lg scrollbar-thumb-muted-foreground">
                <table className="w-full text-left text-sm border-separate border-spacing-0 whitespace-nowrap">
                    <thead className="sticky top-0 bg-card">
                        <tr>
                            <SortableHeader
                                sortKey="id"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="bg-card rounded-tl-lg"
                            >
                                <Package
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Order ID
                            </SortableHeader>
                            <SortableHeader
                                sortKey="client"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="bg-card"
                            >
                                <User
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Client
                            </SortableHeader>
                            <SortableHeader
                                sortKey="destination"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="bg-card"
                            >
                                <MapPinned
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Destination
                            </SortableHeader>
                            <SortableHeader
                                sortKey="orderedOn"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="bg-card"
                            >
                                <CalendarClock
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Ordered On
                            </SortableHeader>
                            <SortableHeader
                                sortKey="deliverBy"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="bg-card"
                            >
                                <CalendarClock
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Deliver By
                            </SortableHeader>
                            <SortableHeader
                                sortKey="packageContent"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="bg-card"
                            >
                                <PackageSearch
                                    size={14}
                                    className="inline mr-0.5 -mt-0.5"
                                />
                                Package Content
                            </SortableHeader>
                            <SortableHeader
                                sortKey="packageSize"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="bg-card"
                            >
                                Package Size
                            </SortableHeader>
                            <SortableHeader
                                sortKey="packageWeight"
                                sortState={sortState}
                                onToggle={toggleSort}
                                className="bg-card rounded-tr-lg"
                            >
                                Package Weight
                            </SortableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders.map((o) => (
                            <tr
                                key={o.id}
                                className="border-t border-border text-foreground transition hover:bg-secondary dark:hover:text-primary"
                            >
                                <td className="px-3 py-2 font-medium ">
                                    {o.id}
                                </td>
                                <td className="px-3 py-2 ">{o.client}</td>
                                <td className="px-3 py-2 ">{o.destination}</td>
                                <td className="px-3 py-2 ">{o.orderedOn}</td>
                                <td className="px-3 py-2 ">{o.deliverBy}</td>
                                <td className="px-3 py-2 ">
                                    {o.packageContent}
                                </td>
                                <td className="px-3 py-2 ">{o.packageSize}</td>
                                <td className="px-3 py-2 ">
                                    {o.packageWeight}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-3 py-8 text-center text-foreground"
                                >
                                    No orders match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
