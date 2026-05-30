import { describe, expect, it } from "vitest";

import {
  DATE_FORMAT,
  DAYS_PER_MONTH,
  DAYS_PER_WEEK,
  DISPLAY_DATE_FORMAT,
  HEALTHY_WEEKLY_LOSS_RATE_PERCENT,
  JAPAN_TIME_ZONE,
  MAX_MEMO_LENGTH,
  MAX_WEIGHT_KG,
  MIN_WEIGHT_KG,
  STORAGE_KEYS,
  WEIGHT_DECIMAL_PLACES
} from "./constants";

describe("weight constants", () => {
  it("defines weight input boundaries", () => {
    expect(MIN_WEIGHT_KG).toBe(0);
    expect(MAX_WEIGHT_KG).toBe(300);
    expect(WEIGHT_DECIMAL_PLACES).toBe(1);
  });
});

describe("memo constants", () => {
  it("defines memo input boundaries", () => {
    expect(MAX_MEMO_LENGTH).toBe(500);
  });
});

describe("simulation constants", () => {
  it("defines period conversion constants", () => {
    expect(DAYS_PER_WEEK).toBe(7);
    expect(DAYS_PER_MONTH).toBe(30);
  });

  it("defines healthy weekly loss rate thresholds", () => {
    expect(HEALTHY_WEEKLY_LOSS_RATE_PERCENT).toEqual({
      SLOW_MAX: 0.5,
      RECOMMENDED_MAX: 1.0,
      FAST_MAX: 1.5
    });
  });
});

describe("date constants", () => {
  it("defines date format and timezone constants", () => {
    expect(DATE_FORMAT).toBe("YYYY-MM-DD");
    expect(DISPLAY_DATE_FORMAT).toBe("YYYY/MM/DD");
    expect(JAPAN_TIME_ZONE).toBe("Asia/Tokyo");
  });
});

describe("storage constants", () => {
  it("defines localStorage keys", () => {
    expect(STORAGE_KEYS).toEqual({
      WEIGHT_RECORDS: "weight-app:weight-records",
      GOAL_SETTING: "weight-app:goal-setting"
    });
  });
});
