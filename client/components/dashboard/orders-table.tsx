import { orders } from "@/lib/dashboard/mockData";
import { useState } from "react";

// Orders Table Component with search functionality
export default function OrdersTable() {
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
                    className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm text-foreground 
                        outline-none transition focus:border-primary-foreground dark:bg-card placeholder:text-muted-foreground"
                />
            </div>

            {/* Scrollable table */}
            <div className="overflow-auto max-h-96 scrollbar-thumb-muted-foreground">
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
                                className="border-t border-border transition hover:bg-secondary dark:hover:text-primary"
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
