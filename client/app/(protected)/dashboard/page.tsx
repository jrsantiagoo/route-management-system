"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import DateRangePicker, {
    type Preset,
} from "@/components/dashboard/date-range-picker";
import StatCard from "@/components/dashboard/stat-card";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ChartCard from "@/components/dashboard/chart-card";
import OrdersTable from "@/components/dashboard/orders-table";
import { getOrders, getOrdersRange } from "@/lib/api/orders";
import { getAllTrips, getTripsRange } from "@/lib/api/trips";
import { getFuelPerOrder, getDistancePerOrder } from "@/lib/api/fuel-log";
import { getEfficiency } from "@/lib/api/efficiency";
import type { Trip, Order } from "@/lib/routing/types";

import { computeTrend } from "@/lib/dashboard/trend-compute";
import { generatePDF } from "@/lib/dashboard/pdf-generator";

// Dashboard Page Component
export default function Dashboard() {
    // Lifted date range state
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    // const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    //     .toISOString()
    //     .slice(0, 10);
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - diff,
    );
    const firstOfWeek = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;

    const [range, setRange] = useState<{
        start: string;
        end: string;
        preset: Preset;
    }>({ start: firstOfWeek, end: today, preset: "thisWeek" });

    // Maps selected preset to a comparison period.
    // Returns undefined for "allTime" & "custom" to hide subtitle.
    const presetComparison: Record<Preset, string | undefined> = {
        today: "yesterday",
        thisWeek: "last week",
        thisMonth: "last month",
        thisYear: "last year",
        allTime: undefined,
        custom: undefined,
    };

    const [loading, setLoading] = useState(true);
    const pendingLoads = useRef(0);
    const trackLoad = useCallback(function <T>(promise: Promise<T>) {
        pendingLoads.current += 1;
        return promise.finally(() => {
            pendingLoads.current -= 1;
            if (pendingLoads.current === 0) setLoading(false);
        });
    }, []);

    const [orders, setOrders] = useState<Order[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        trackLoad(
            Promise.all([
                getOrdersRange(range.start, range.end),
                getTripsRange(range.start, range.end),
            ]).then(([ordersRes, tripsRes]) => {
                setOrders(ordersRes.success ? ordersRes.data : []);
                setTrips(tripsRes.success ? tripsRes.data : []);
            })
        );
    }, [range, trackLoad]);

    // Derive stats from orders data
    const totalTrips = trips.filter((t) => t.status === "COMPLETED").length;
    const delivered = orders.filter((o) => o.status === "COMPLETED").length;

    // Fuel per Order
    const [fuelData, setFuelData] = useState<
        { day: string; fuel: number; trend: number }[]
    >([]);
    // Distance per Order
    const [distanceData, setDistanceData] = useState<
        { day: string; distance: number; trend: number }[]
    >([]);
    // Overall Efficiency
    const [efficiency, setEfficiency] = useState<number>(0);
    // For Efficiency Comparison
    const [previousEfficiency, setPreviousEfficiency] = useState<number | null>(
        null,
    );

    function getComparisonRange(start: string, end: string) {
        const s = new Date(start),
            e = new Date(end);
        const periodMs = e.getTime() - s.getTime();
        const prevEnd = new Date(s.getTime() - 86400000);
        const prevStart = new Date(prevEnd.getTime() - periodMs);
        return {
            start: prevStart.toISOString().slice(0, 10),
            end: prevEnd.toISOString().slice(0, 10),
        };
    }

    useEffect(() => {
        getFuelPerOrder(range.start, range.end).then((res) => {
            const mapped = (res.data ?? []).map(
                (d: { date: string; fuelPerOrder: number }) => ({
                    day: d.date,
                    fuel: d.fuelPerOrder,
                }),
            );

            if (compRange) {
                const [prevFuelRes, prevDistRes] = await Promise.all([
                    getFuelPerOrder(compRange.start, compRange.end),
                    getDistancePerOrder(compRange.start, compRange.end),
                ]);

                const prevFuelMapped = (prevFuelRes.data ?? []).map(
                    (d: { date: string; fuelPerOrder: number }) => ({
                        day: d.date,
                        fuel: d.fuelPerOrder,
                    })
                );
                const prevDistMapped = (prevDistRes.data ?? []).map(
                    (d: { date: string; distancePerOrder: number }) => ({
                        day: d.date,
                        distance: d.distancePerOrder,
                    })
                );

                setFuelData(
                    mergePrevTrend(
                        computeTrend(fuelMapped, "fuel"),
                        computeTrend(prevFuelMapped, "fuel")
                    )
                );
                setDistanceData(
                    mergePrevTrend(
                        computeTrend(distMapped, "distance"),
                        computeTrend(prevDistMapped, "distance")
                    )
                );
            } else {
                setFuelData(computeTrend(fuelMapped, "fuel"));
                setDistanceData(computeTrend(distMapped, "distance"));
            }
        }

        const tasks: Promise<unknown>[] = [];
        tasks.push(fetchCurrentAndComparison());

        tasks.push(
            getEfficiency(range.start, range.end).then((res) => {
                if (res.success) setEfficiency(res.data);
            })
        );

        if (presetComparison[range.preset] !== undefined) {
            const compRange = getComparisonRange(range.start, range.end);
            if (compRange) {
                tasks.push(
                    getEfficiency(compRange.start, compRange.end).then(
                        (res) => {
                            if (res.success) setPreviousEfficiency(res.data);
                        }
                    )
                );
            }
        }

        trackLoad(Promise.all(tasks));
    }, [range, trackLoad]);

    const efficiencyChange =
        previousEfficiency !== null && previousEfficiency !== 0
            ? Math.round(
                  ((efficiency - previousEfficiency) / previousEfficiency) *
                      100,
              )
            : 0;

    // Checks if efficiency is going up or down
    const isEfficiencyPositive = efficiencyChange >= 0;

    // Grab the comparison label for the active preset.
    const comparisonLabel = presetComparison[range.preset];

    // Derive subtitle for each stat card
    const tripsSubtitle = `out of ${trips.length} total trips`;
    const deliveredSubtitle = `out of ${orders.length} total orders`;
    const efficiencySubtitle: React.ReactNode =
        comparisonLabel === undefined ? undefined : (
            <>
                {isEfficiencyPositive ? (
                    <TrendingUp size={24} className="text-green-500" />
                ) : (
                    <TrendingDown size={24} className="text-red-500" />
                )}
                {isEfficiencyPositive ? "+" : ""}
                {efficiencyChange} km/L compared to {comparisonLabel}
            </>
        );

    const router = useRouter();
    const handleDownload = useCallback(() => {
        generatePDF(
            totalTrips,
            efficiency,
            delivered,
            distanceData,
            fuelData
        );
    }, [totalTrips, efficiency, delivered, distanceData, fuelData]);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="flex flex-col gap-6">
            {/* Header with title and download button */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-md text-muted-foreground">
                        Performance metrics and analytics
                    </p>
                </div>

                {/* Allows user to select specific dates */}
                <div className="flex items-center gap-3">
                    <DateRangePicker
                        startDate={range.start}
                        endDate={range.end}
                        preset={range.preset}
                        onChange={setRange}
                    />
                    <button
                        onClick={handleDownload}
                        className="rounded-lg bg-btn px-4.5 py-1.5 text-sm font-semibold text-primary-foreground shadow transition 
                        hover:bg-secondary hover:text-foreground dark:hover:text-primary"
                    >
                        Full Summary
                    </button>
                </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                <StatCard
                    title="Upcoming Trips"
                    value={String(upcomingTrips)}
                    subtitle={tripsSubtitle}
                />
                <StatCard
                    title="Successful Trips"
                    value={String(totalTrips)}
                    subtitle={tripsSubtitle}
                />
                <StatCard
                    title="Efficiency"
                    value={String(efficiency)}
                    unit="km/L"
                    subtitle={efficiencySubtitle}
                />
                <StatCard
                    title="Delivered Orders"
                    value={String(delivered)}
                    subtitle={deliveredSubtitle}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Average Distance per Order (km)">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={distanceData}>
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
                            <Bar
                                dataKey="distance"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                name="Distance (km)"
                            />
                            <Line
                                type="monotone"
                                dataKey="trend"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                dot={false}
                                name="Trend (3-day avg)"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Average Fuel Usage per Order (L)">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={fuelData}>
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
                            <Bar
                                dataKey="fuel"
                                fill="#F59E0B"
                                radius={[4, 4, 0, 0]}
                                name="Fuel (L)"
                            />
                            <Line
                                type="monotone"
                                dataKey="trend"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                name="Trend (3-day avg)"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Orders Table */}
            <OrdersTable orders={orders} />
        </div>
    );
}
