"use client";

import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
    BarChart,
    Bar,
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

// Helper Function: Generates a PDF summary of the route management statistics and orders
function generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Route Management – Full Summary", 14, 22);

    // Daily
    doc.setFontSize(14);
    doc.text("Daily Statistics", 14, 36);

    const dailyRows = [
        ["Monday", "12.4 km", "8.2 L"],
        ["Tuesday", "15.8 km", "10.5 L"],
        ["Wednesday", "11.2 km", "7.1 L"],
        ["Thursday", "18.5 km", "12.3 L"],
        ["Friday", "14.1 km", "9.6 L"],
        ["Saturday", "9.7 km", "6.4 L"],
        ["Sunday", "10.3 km", "7.8 L"],
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable(doc, {
        startY: 42,
        head: [["Day", "Avg Distance / Order", "Avg Fuel / Order"]],
        body: dailyRows,
        theme: "striped",
    });

    // Weekly Statistics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const weeklyStartY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Weekly Statistics", 14, weeklyStartY);

    const weeklyRows = [
        ["Week 1", "88.5 km", "58.2 L"],
        ["Week 2", "95.2 km", "63.7 L"],
        ["Week 3", "82.1 km", "54.9 L"],
        ["Week 4", "101.3 km", "68.1 L"],
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable(doc, {
        startY: weeklyStartY + 6,
        head: [["Week", "Avg Distance / Order", "Avg Fuel / Order"]],
        body: weeklyRows,
        theme: "striped",
    });

    // Summary of Statistics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const summaryY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Performance Summary", 14, summaryY);
    doc.setFontSize(11);
    doc.text("Total Successful Trips: 1,234", 14, summaryY + 8);
    doc.text("Efficiency: 87%", 14, summaryY + 16);
    doc.text("Delivered Orders: 956", 14, summaryY + 24);

    doc.save("route-management-summary.pdf");
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
        <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
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
        <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="mb-4 text-base font-semibold text-gray-700">
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
            o.packageContent.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="rounded-xl bg-white p-6 shadow">
            {/* Header + search */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-700">
                    Orders
                </h3>
                <input
                    type="text"
                    placeholder="Search orders…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500"
                />
            </div>

            {/* Scrollable table */}
            <div className="overflow-auto max-h-96">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="sticky top-0 bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 font-semibold text-gray-600">
                                Order ID
                            </th>
                            <th className="px-3 py-2 font-semibold text-gray-600">
                                Client
                            </th>
                            <th className="px-3 py-2 font-semibold text-gray-600">
                                Destination
                            </th>
                            <th className="px-3 py-2 font-semibold text-gray-600">
                                Ordered On
                            </th>
                            <th className="px-3 py-2 font-semibold text-gray-600">
                                Deliver By
                            </th>
                            <th className="px-3 py-2 font-semibold text-gray-600">
                                Package Content
                            </th>
                            <th className="px-3 py-2 font-semibold text-gray-600">
                                Package Size
                            </th>
                            <th className="px-3 py-2 font-semibold text-gray-600">
                                Package Weight
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((o) => (
                            <tr
                                key={o.id}
                                className="border-t border-gray-200 transition hover:bg-gray-50"
                            >
                                <td className="px-3 py-2 font-medium text-gray-900">
                                    {o.id}
                                </td>
                                <td className="px-3 py-2 text-gray-700">
                                    {o.client}
                                </td>
                                <td className="px-3 py-2 text-gray-700">
                                    {o.destination}
                                </td>
                                <td className="px-3 py-2 text-gray-700">
                                    {o.orderedOn}
                                </td>
                                <td className="px-3 py-2 text-gray-700">
                                    {o.deliverBy}
                                </td>
                                <td className="px-3 py-2 text-gray-700">
                                    {o.packageContent}
                                </td>
                                <td className="px-3 py-2 text-gray-700">
                                    {o.packageSize}
                                </td>
                                <td className="px-3 py-2 text-gray-700">
                                    {o.packageWeight}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-3 py-8 text-center text-gray-400"
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
export default function dashboard() {
    const handleDownload = useCallback(() => {
        generatePDF();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Header with title and download button */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <button
                    onClick={handleDownload}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                >
                    Full Summary
                </button>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard title="Total Successful Trips" value="1,234" />
                <StatCard title="Efficiency" value="87" unit="%" />
                <StatCard title="Delivered Orders" value="956" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Average Distance per Order (km)">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyDistanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="distance"
                                fill="#3b82f6"
                                name="Distance (km)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Average Fuel Usage per Order (L)">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyFuelData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="fuel"
                                fill="#f59e0b"
                                name="Fuel (L)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Orders Table */}
            <OrdersTable />
        </div>
    );
}
