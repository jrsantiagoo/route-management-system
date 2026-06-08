export function formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
}

export function formatDuration(minutes: number): string {
    const total = Math.round(minutes);
    if (total < 60) return `${total} min`;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatWeek(isoMonday: string): string {
    const [y, mo, d] = isoMonday.split("-").map(Number);
    const start = new Date(y, mo - 1, d);
    const end = new Date(y, mo - 1, d + 6);
    const short: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
    };
    const full: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
    };
    return `${start.toLocaleDateString("en-PH", short)} – ${end.toLocaleDateString("en-PH", full)}`;
}
