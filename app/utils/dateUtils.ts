/**
 * Get the current date in NY timezone (America/New_York)
 * Optionally accepts a test date override from localStorage
 */
export function getCurrentNYDate(): Date {
    // Check for test date override
    if (typeof window !== "undefined") {
        const override = localStorage.getItem("dateOverride");
        if (override) {
            return new Date(override + "T00:00:00");
        }
    }

    // Get current time in NY timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const parts = formatter.formatToParts(new Date());
    const year = parts.find((p) => p.type === "year")!.value;
    const month = parts.find((p) => p.type === "month")!.value;
    const day = parts.find((p) => p.type === "day")!.value;

    // Create date at midnight NY time
    return new Date(`${year}-${month}-${day}T00:00:00`);
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Get the current month key in YYYY-MM format
 */
export function getCurrentMonthKey(date?: Date): string {
    const d = date || getCurrentNYDate();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}
