"use client";

import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

// Hardcoded Data for visualization purposes
const dailyDistanceData = [
    { day: "Mon", distance: 12.4 },
    { day: "Tue", distance: 15.8 },
    { day: "Wed", distance: 11.2 },
    { day: "Thu", distance: 18.5 },
    { day: "Fri", distance: 14.1 },
    { day: "Sat", distance: 9.7 },
    { day: "Sun", distance: 10.3 },
];

const dailyFuelData = [
    { day: "Mon", fuel: 8.2 },
    { day: "Tue", fuel: 10.5 },
    { day: "Wed", fuel: 7.1 },
    { day: "Thu", fuel: 12.3 },
    { day: "Fri", fuel: 9.6 },
    { day: "Sat", fuel: 6.4 },
    { day: "Sun", fuel: 7.8 },
];

interface Order {
    id: string;
    client: string;
    destination: string;
    orderedOn: string;
    deliverBy: string;
    packageContent: string;
    packageSize: string;
    packageWeight: string;
}

const orders: Order[] = [
    {
        id: "ORD-1001",
        client: "Acme Corp",
        destination: "New York, NY",
        orderedOn: "2026-06-01",
        deliverBy: "2026-06-05",
        packageContent: "Electronics",
        packageSize: "40×30×20 cm",
        packageWeight: "2.5 kg",
    },
    {
        id: "ORD-1002",
        client: "Globex Inc",
        destination: "Los Angeles, CA",
        orderedOn: "2026-06-01",
        deliverBy: "2026-06-06",
        packageContent: "Clothing",
        packageSize: "60×40×30 cm",
        packageWeight: "5.0 kg",
    },
    {
        id: "ORD-1003",
        client: "Initech",
        destination: "Chicago, IL",
        orderedOn: "2026-06-02",
        deliverBy: "2026-06-07",
        packageContent: "Books",
        packageSize: "30×25×15 cm",
        packageWeight: "3.2 kg",
    },
    {
        id: "ORD-1004",
        client: "Hooli",
        destination: "San Francisco, CA",
        orderedOn: "2026-06-02",
        deliverBy: "2026-06-08",
        packageContent: "Server Parts",
        packageSize: "80×60×40 cm",
        packageWeight: "15.0 kg",
    },
    {
        id: "ORD-1005",
        client: "Umbrella Corp",
        destination: "Houston, TX",
        orderedOn: "2026-06-03",
        deliverBy: "2026-06-09",
        packageContent: "Medical Supplies",
        packageSize: "50×40×30 cm",
        packageWeight: "8.0 kg",
    },
    {
        id: "ORD-1006",
        client: "Stark Industries",
        destination: "Boston, MA",
        orderedOn: "2026-06-03",
        deliverBy: "2026-06-10",
        packageContent: "Prototype Parts",
        packageSize: "70×50×40 cm",
        packageWeight: "12.5 kg",
    },
    {
        id: "ORD-1007",
        client: "Wayne Enterprises",
        destination: "Gotham, NJ",
        orderedOn: "2026-06-04",
        deliverBy: "2026-06-11",
        packageContent: "Automotive Parts",
        packageSize: "100×60×50 cm",
        packageWeight: "22.0 kg",
    },
    {
        id: "ORD-1008",
        client: "Oscorp",
        destination: "Seattle, WA",
        orderedOn: "2026-06-04",
        deliverBy: "2026-06-12",
        packageContent: "Lab Equipment",
        packageSize: "60×40×40 cm",
        packageWeight: "18.0 kg",
    },
    {
        id: "ORD-1009",
        client: "Cyberdyne Systems",
        destination: "Denver, CO",
        orderedOn: "2026-06-05",
        deliverBy: "2026-06-13",
        packageContent: "Circuit Boards",
        packageSize: "35×25×10 cm",
        packageWeight: "1.8 kg",
    },
    {
        id: "ORD-1010",
        client: "Soylent Corp",
        destination: "Miami, FL",
        orderedOn: "2026-06-05",
        deliverBy: "2026-06-14",
        packageContent: "Food Products",
        packageSize: "50×40×30 cm",
        packageWeight: "10.0 kg",
    },
];

// Derived weekly data (from daily averages)
const weeklyDistanceData = [
    {
        week: "W1",
        distance: +(
            dailyDistanceData.reduce((s, d) => s + d.distance, 0) * 1.0
        ).toFixed(1),
    },
    {
        week: "W2",
        distance: +(
            dailyDistanceData.reduce((s, d) => s + d.distance, 0) * 1.08
        ).toFixed(1),
    },
    {
        week: "W3",
        distance: +(
            dailyDistanceData.reduce((s, d) => s + d.distance, 0) * 0.93
        ).toFixed(1),
    },
    {
        week: "W4",
        distance: +(
            dailyDistanceData.reduce((s, d) => s + d.distance, 0) * 1.15
        ).toFixed(1),
    },
];

const weeklyFuelData = [
    {
        week: "W1",
        fuel: +(dailyFuelData.reduce((s, d) => s + d.fuel, 0) * 1.0).toFixed(1),
    },
    {
        week: "W2",
        fuel: +(dailyFuelData.reduce((s, d) => s + d.fuel, 0) * 1.07).toFixed(
            1,
        ),
    },
    {
        week: "W3",
        fuel: +(dailyFuelData.reduce((s, d) => s + d.fuel, 0) * 0.91).toFixed(
            1,
        ),
    },
    {
        week: "W4",
        fuel: +(dailyFuelData.reduce((s, d) => s + d.fuel, 0) * 1.12).toFixed(
            1,
        ),
    },
];

// Line Chart Drawing Helper (for PDF generation)
function drawLineChart(
    doc: jsPDF,
    items: Record<string, string | number>[],
    xKey: string,
    yKey: string,
    label: string,
    color: [number, number, number],
    x: number,
    y: number,
    w: number,
    h: number,
) {
    const values = items.map((d) => Number(d[yKey]));
    const maxVal = Math.max(...values);

    const padL = 12;
    const padB = 8;
    const padT = 4;

    const plotL = x + padL;
    const plotR = x + w;
    const plotT = y + padT;
    const plotB = y + h - padB;

    const plotW = plotR - plotL;
    const plotH = plotB - plotT;

    // Chart label
    doc.setFontSize(7);
    doc.text(label, x, y - 2);

    // Axes
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(plotL, plotB, plotR, plotB);
    doc.line(plotL, plotT, plotL, plotB);

    // Y-axis ticks and labels
    doc.setFontSize(5);
    doc.setTextColor(156, 163, 175);
    const yTicks = [0, 0.25, 0.5, 0.75, 1];
    yTicks.forEach((t) => {
        const yPos = plotB - t * plotH;
        doc.text(
            String(Math.round(maxVal * t * 10) / 10),
            plotL - 2,
            yPos + 1.5,
            { align: "right" },
        );
        doc.line(plotL - 2, yPos, plotL, yPos);
    });

    // Compute point positions
    const points = items.map((d, i) => {
        const px = plotL + (i + 0.5) * (plotW / items.length);
        const py = plotB - (Number(d[yKey]) / maxVal) * plotH;
        return {
            x: px,
            y: py,
            label: String(d[xKey]),
            value: Number(d[yKey]),
        };
    });

    // Connect points with lines
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6);
    for (let i = 1; i < points.length; i++) {
        doc.line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
    }

    // X-axis labels
    doc.setFontSize(5);
    doc.setTextColor(156, 163, 175);
    points.forEach((p) => {
        doc.text(p.label, p.x, plotB + 4, { align: "center" });
    });

    // Data point markers and value labels
    doc.setFontSize(5);
    doc.setTextColor(17, 24, 39);
    points.forEach((p) => {
        // Marker circle
        doc.setFillColor(...color);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).circle(p.x, p.y, 1.2, "F");

        // Value above
        doc.text(String(p.value), p.x, p.y - 3, { align: "center" });
    });
}

// Helper Function: Generates a PDF summary of the route management statistics and orders
function generatePDF(
    totalTrips: number,
    efficiency: number,
    delivered: number,
) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    const titleStr = `Route Management Statistics as of ${dateStr} ${timeStr}`;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text(titleStr, 14, 20);

    // Performance Summary
    doc.setFontSize(14);
    doc.text("Performance Summary", 14, 34);

    // Render three stat cards side by side like the dashboard
    const cardW = 55;
    const cardH = 22;
    const cardGap = 6;
    const cardY = 40;
    const stats = [
        { title: "Total Successful Trips", value: String(totalTrips) },
        { title: "Efficiency", value: `${efficiency}%` },
        { title: "Delivered Orders", value: String(delivered) },
    ];

    stats.forEach((stat, i) => {
        const cx = 14 + i * (cardW + cardGap);

        // Card background
        doc.setFillColor(255, 255, 255);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).rect(cx, cardY, cardW, cardH, "F");

        // Card border
        doc.setDrawColor(229, 231, 235);
        doc.line(cx, cardY, cx + cardW, cardY);
        doc.line(cx, cardY + cardH, cx + cardW, cardY + cardH);
        doc.line(cx, cardY, cx, cardY + cardH);
        doc.line(cx + cardW, cardY, cx + cardW, cardY + cardH);

        // Title
        doc.setFontSize(6);
        doc.setTextColor(107, 114, 128);
        doc.text(stat.title, cx + cardW / 2, cardY + 8, { align: "center" });

        // Value
        doc.setFontSize(14);
        doc.setTextColor(17, 24, 39);
        doc.setFont("helvetica", "bold");
        doc.text(stat.value, cx + cardW / 2, cardY + 18, { align: "center" });
        doc.setFont("helvetica", "normal");
    });

    // Daily Statistics Charts
    const chartY = 72;
    const chartW = 85;
    const chartH = 45;
    const colGap = 8;

    doc.setFontSize(12);
    doc.text("Daily Statistics", 14, chartY - 4);

    drawLineChart(
        doc,
        dailyDistanceData,
        "day",
        "distance",
        "Avg Distance (km) / Order",
        [59, 130, 246],
        14,
        chartY + 2,
        chartW,
        chartH,
    );
    drawLineChart(
        doc,
        dailyFuelData,
        "day",
        "fuel",
        "Avg Fuel (L) / Order",
        [245, 158, 11],
        14 + chartW + colGap,
        chartY + 2,
        chartW,
        chartH,
    );

    // Weekly Statistics Charts
    const weeklyY = chartY + chartH + 16;

    doc.setFontSize(12);
    doc.text("Weekly Statistics", 14, weeklyY - 4);

    drawLineChart(
        doc,
        weeklyDistanceData,
        "week",
        "distance",
        "Avg Distance (km) / Order",
        [59, 130, 246],
        14,
        weeklyY + 2,
        chartW,
        chartH,
    );
    drawLineChart(
        doc,
        weeklyFuelData,
        "week",
        "fuel",
        "Avg Fuel (L) / Order",
        [245, 158, 11],
        14 + chartW + colGap,
        weeklyY + 2,
        chartW,
        chartH,
    );

    const filename = `${titleStr}.pdf`;
    doc.save(filename);
}

// Stat Card sub-component
function StatCard({
    title,
    value,
    unit,
}: {
    title: string;
    value: string;
    unit?: string;
}) {
    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
                {value}
                {unit && (
                    <span className="ml-1 text-lg font-normal text-gray-400">
                        {unit}
                    </span>
                )}
            </p>
        </div>
    );
}

// Chart Card sub-component
function ChartCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            <h3 className="mb-4 text-base font-semibold text-foreground">
                {title}
            </h3>
            <div className="h-72">{children}</div>
        </div>
    );
}

// Orders Table Component with search functionality
function OrdersTable() {
    const [search, setSearch] = useState("");

    const filtered = orders.filter(
        (o) =>
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.client.toLowerCase().includes(search.toLowerCase()) ||
            o.destination.toLowerCase().includes(search.toLowerCase()) ||
            o.packageContent.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="rounded-xl bg-card p-6 shadow-lg shadow-primary border border-border">
            {/* Header + search */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">
                    Orders
                </h3>
                <input
                    type="text"
                    placeholder="Search orders…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-primary-foreground"
                />
            </div>

            {/* Scrollable table */}
            <div className="overflow-auto max-h-96">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="sticky top-0 bg-card">
                        <tr>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Order ID
                            </th>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Client
                            </th>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Destination
                            </th>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Ordered On
                            </th>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Deliver By
                            </th>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Package Content
                            </th>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Package Size
                            </th>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Package Weight
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((o) => (
                            <tr
                                key={o.id}
                                className="border-t border-border transition hover:bg-secondary"
                            >
                                <td className="px-3 py-2 font-medium text-foreground">
                                    {o.id}
                                </td>
                                <td className="px-3 py-2 text-foreground">
                                    {o.client}
                                </td>
                                <td className="px-3 py-2 text-foreground">
                                    {o.destination}
                                </td>
                                <td className="px-3 py-2 text-foreground">
                                    {o.orderedOn}
                                </td>
                                <td className="px-3 py-2 text-foreground">
                                    {o.deliverBy}
                                </td>
                                <td className="px-3 py-2 text-foreground">
                                    {o.packageContent}
                                </td>
                                <td className="px-3 py-2 text-foreground">
                                    {o.packageSize}
                                </td>
                                <td className="px-3 py-2 text-foreground">
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

// Dashboard Page Component
export default function Dashboard() {
    // Derive stats from orders data
    const totalTrips = orders.length;
    const onTimeThreshold = 5;
    const onTime = orders.filter((o) => {
        const [oy, om, od] = o.orderedOn.split("-").map(Number);
        const [dy, dm, dd] = o.deliverBy.split("-").map(Number);
        const orderDate = new Date(oy, om - 1, od);
        const deliverDate = new Date(dy, dm - 1, dd);
        const diffDays =
            (deliverDate.getTime() - orderDate.getTime()) /
            (1000 * 60 * 60 * 24);
        return diffDays <= onTimeThreshold;
    }).length;
    const efficiency = Math.round((onTime / totalTrips) * 100);
    const delivered = orders.length;

    const handleDownload = useCallback(() => {
        generatePDF(totalTrips, efficiency, delivered);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Header with title and download button */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button
                    onClick={handleDownload}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:bg-secondary hover:text-foreground"
                >
                    Full Summary
                </button>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                    title="Total Successful Trips"
                    value={String(totalTrips)}
                />
                <StatCard
                    title="Efficiency"
                    value={String(efficiency)}
                    unit="%"
                />
                <StatCard title="Delivered Orders" value={String(delivered)} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Average Distance per Order (km)">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyDistanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip
                                labelStyle={{
                                    color: "var(--color-foreground)",
                                }}
                                contentStyle={{
                                    backgroundColor: "var(--color-card)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="distance"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: "#3b82f6", r: 4 }}
                                name="Distance (km)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Average Fuel Usage per Order (L)">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyFuelData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip
                                labelStyle={{
                                    color: "var(--color-foreground)",
                                }}
                                contentStyle={{
                                    backgroundColor: "var(--color-card)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="fuel"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ fill: "#f59e0b", r: 4 }}
                                name="Fuel (L)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Orders Table */}
            <OrdersTable />
        </div>
    );
}
