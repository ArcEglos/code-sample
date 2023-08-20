/**
 * Formats a date for displaying it.
 * @param {string | number | Date } timestamp value to format, in a format that is accepted by the Date constructor.
 * @param {string} [timeZone] {@link https://www.iana.org/time-zones IANA} name of timezone used for displaying. Machine default timezone is used when not set.
 * @returns {string} the formatted date string
 */
export function formatDate(
  timestamp: string | number | Date,
  timeZone?: string
) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  }).format(new Date(timestamp));
}

/**
 * Formats a date and time for displaying it.
 * @param {string | number | Date } timestamp value to format, in a format that is accepted by the Date constructor.
 * @param {string} [timeZone] {@link https://www.iana.org/time-zones IANA} name of timezone used for displaying. Machine default timezone is used when not set.
 * @returns {string} the formatted date string
 */
export function formatDateTime(
  timestamp: string | number | Date,
  timeZone?: string
) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
    timeZone,
  }).format(new Date(timestamp));
}
