import jsPDF from "jspdf";
import {
    dailyDistanceData,
    dailyFuelData,
    weeklyDistanceData,
    weeklyFuelData,
} from "./mockData";

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
export function generatePDF(
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
