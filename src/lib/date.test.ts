import { describe, expect, it } from "vitest";

import {
  formatDate,
  getToday,
  isSameDate,
  isValidDateString,
  parseDate
} from "./date";

describe("getToday", () => {
  it("returns the current date in Asia/Tokyo as YYYY-MM-DD", () => {
    const utcTimeBeforeJapanMidnight = new Date("2026-05-29T15:00:00.000Z");

    expect(getToday(utcTimeBeforeJapanMidnight)).toBe("2026-05-30");
  });
});

describe("isValidDateString", () => {
  it("returns true for a valid YYYY-MM-DD date", () => {
    expect(isValidDateString("2026-05-30")).toBe(true);
  });

  it("returns true for a valid leap day", () => {
    expect(isValidDateString("2024-02-29")).toBe(true);
  });

  it("returns false when the format is not YYYY-MM-DD", () => {
    expect(isValidDateString("2026/05/30")).toBe(false);
  });

  it("returns false when the date does not exist", () => {
    expect(isValidDateString("2026-02-29")).toBe(false);
  });
});

describe("formatDate", () => {
  it("formats a storage date for display", () => {
    expect(formatDate("2026-05-30")).toBe("2026/05/30");
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatDate("2026-13-01")).toBe("");
  });
});

describe("parseDate", () => {
  it("parses a valid storage date as a UTC date", () => {
    expect(parseDate("2026-05-30")?.toISOString()).toBe(
      "2026-05-30T00:00:00.000Z"
    );
  });

  it("returns null for an invalid date", () => {
    expect(parseDate("")).toBeNull();
  });
});

describe("isSameDate", () => {
  it("returns true when both dates are valid and equal", () => {
    expect(isSameDate("2026-05-30", "2026-05-30")).toBe(true);
  });

  it("returns false when both dates are valid and different", () => {
    expect(isSameDate("2026-05-30", "2026-05-31")).toBe(false);
  });

  it("returns false when either date is invalid", () => {
    expect(isSameDate("2026-05-30", "invalid")).toBe(false);
  });
});
