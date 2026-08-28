// Sochebar operates in one place (Malawi, Africa/Blantyre, UTC+2, no DST),
// so "today"/"a given day" is defined relative to that fixed offset rather
// than the server's own timezone or UTC. This matters specifically for
// activity late at night: local 00:00-02:00 is still "yesterday" in UTC,
// which is exactly when a bar is open. Using the server's local timezone
// (e.g. via Date#setHours) is unreliable too, since that depends on how
// the host machine is configured (Render defaults to UTC). An explicit
// offset sidesteps both problems.
const BUSINESS_UTC_OFFSET = '+02:00';

/**
 * Given a date-only string like "2026-08-22", returns the UTC instants
 * corresponding to the start and end of that calendar day in the
 * business's local timezone.
 */
export function localDayBounds(dateStr: string): { gte: Date; lte: Date } {
  return {
    gte: new Date(`${dateStr}T00:00:00.000${BUSINESS_UTC_OFFSET}`),
    lte: new Date(`${dateStr}T23:59:59.999${BUSINESS_UTC_OFFSET}`),
  };
}

/** Same as localDayBounds, but only the upper bound (for from/to ranges). */
export function localEndOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999${BUSINESS_UTC_OFFSET}`);
}

/** Same as localDayBounds, but only the lower bound (for from/to ranges). */
export function localStartOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000${BUSINESS_UTC_OFFSET}`);
}
