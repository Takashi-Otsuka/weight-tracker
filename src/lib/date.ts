const JAPAN_TIME_ZONE = "Asia/Tokyo";
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function getToday(now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: JAPAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const parts = formatter.formatToParts(now);
  const year = getDatePart(parts, "year");
  const month = getDatePart(parts, "month");
  const day = getDatePart(parts, "day");

  return `${year}-${month}-${day}`;
}

function getDatePart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
): string {
  return parts.find((part) => part.type === type)!.value;
}

export function isValidDateString(value: string): boolean {
  const match = DATE_PATTERN.exec(value);

  if (match === null) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function formatDate(value: string): string {
  if (!isValidDateString(value)) {
    return "";
  }

  return value.replaceAll("-", "/");
}

export function parseDate(value: string): Date | null {
  if (!isValidDateString(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

export function isSameDate(left: string, right: string): boolean {
  return isValidDateString(left) && isValidDateString(right) && left === right;
}
