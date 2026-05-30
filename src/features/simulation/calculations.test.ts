import { describe, expect, it } from "vitest";

import {
  calculateSimulationByDate,
  calculateSimulationByPace,
  evaluatePaceLevel
} from "./calculations";

describe("calculateSimulationByDate", () => {
  it("calculates required loss pace from target date", () => {
    const result = calculateSimulationByDate({
      currentWeightKg: 80,
      targetWeightKg: 75,
      targetDate: "2026-06-29",
      today: "2026-05-30"
    });

    expect(result).toEqual({
      totalLossKg: 5,
      days: 30,
      dailyLossKg: 5 / 30,
      weeklyLossKg: (5 / 30) * 7,
      monthlyLossKg: 5,
      weeklyLossRatePercent: (((5 / 30) * 7) / 80) * 100,
      paceLevel: "fast",
      message: "やや速いペースです"
    });
  });

  it("returns null when current weight is invalid", () => {
    expect(
      calculateSimulationByDate({
        currentWeightKg: 0,
        targetWeightKg: 75,
        targetDate: "2026-06-29",
        today: "2026-05-30"
      })
    ).toBeNull();
  });

  it("returns null when target weight is invalid", () => {
    expect(
      calculateSimulationByDate({
        currentWeightKg: 80,
        targetWeightKg: Number.NaN,
        targetDate: "2026-06-29",
        today: "2026-05-30"
      })
    ).toBeNull();
  });

  it("returns null when target weight is not less than current weight", () => {
    expect(
      calculateSimulationByDate({
        currentWeightKg: 80,
        targetWeightKg: 80,
        targetDate: "2026-06-29",
        today: "2026-05-30"
      })
    ).toBeNull();
  });

  it("returns null when today is invalid", () => {
    expect(
      calculateSimulationByDate({
        currentWeightKg: 80,
        targetWeightKg: 75,
        targetDate: "2026-06-29",
        today: "invalid"
      })
    ).toBeNull();
  });

  it("returns null when target date is invalid", () => {
    expect(
      calculateSimulationByDate({
        currentWeightKg: 80,
        targetWeightKg: 75,
        targetDate: "2026/06/29",
        today: "2026-05-30"
      })
    ).toBeNull();
  });

  it("returns null when target date is today", () => {
    expect(
      calculateSimulationByDate({
        currentWeightKg: 80,
        targetWeightKg: 75,
        targetDate: "2026-05-30",
        today: "2026-05-30"
      })
    ).toBeNull();
  });

  it("returns null when target date is in the past", () => {
    expect(
      calculateSimulationByDate({
        currentWeightKg: 80,
        targetWeightKg: 75,
        targetDate: "2026-05-29",
        today: "2026-05-30"
      })
    ).toBeNull();
  });

  it("uses today's date when today is omitted", () => {
    const result = calculateSimulationByDate({
      currentWeightKg: 80,
      targetWeightKg: 79,
      targetDate: "2099-01-01"
    });

    expect(result?.totalLossKg).toBe(1);
  });
});

describe("calculateSimulationByPace", () => {
  it("calculates estimated target date from daily loss pace", () => {
    const result = calculateSimulationByPace({
      currentWeightKg: 80,
      targetWeightKg: 75,
      dailyLossKg: 0.2,
      today: "2026-05-30"
    });

    expect(result).toEqual({
      totalLossKg: 5,
      days: 25,
      dailyLossKg: 0.2,
      weeklyLossKg: 1.4000000000000001,
      monthlyLossKg: 6,
      weeklyLossRatePercent: 1.7500000000000002,
      paceLevel: "too_fast",
      message: "目標期間の見直しをおすすめします",
      estimatedTargetDate: "2026-06-24"
    });
  });

  it("rounds up required days", () => {
    const result = calculateSimulationByPace({
      currentWeightKg: 80,
      targetWeightKg: 75,
      dailyLossKg: 2,
      today: "2026-05-30"
    });

    expect(result?.days).toBe(3);
    expect(result?.estimatedTargetDate).toBe("2026-06-02");
  });

  it("returns null when total loss cannot be calculated", () => {
    expect(
      calculateSimulationByPace({
        currentWeightKg: 75,
        targetWeightKg: 80,
        dailyLossKg: 0.1,
        today: "2026-05-30"
      })
    ).toBeNull();
  });

  it("returns null when daily loss is invalid", () => {
    expect(
      calculateSimulationByPace({
        currentWeightKg: 80,
        targetWeightKg: 75,
        dailyLossKg: 0,
        today: "2026-05-30"
      })
    ).toBeNull();
  });

  it("returns null when today is invalid", () => {
    expect(
      calculateSimulationByPace({
        currentWeightKg: 80,
        targetWeightKg: 75,
        dailyLossKg: 0.2,
        today: "invalid"
      })
    ).toBeNull();
  });

  it("uses today's date when today is omitted", () => {
    const result = calculateSimulationByPace({
      currentWeightKg: 80,
      targetWeightKg: 79,
      dailyLossKg: 0.1
    });

    expect(result?.totalLossKg).toBe(1);
  });
});

describe("evaluatePaceLevel", () => {
  it("returns slow below 0.5%", () => {
    expect(evaluatePaceLevel(0.49)).toBe("slow");
  });

  it("returns recommended from 0.5% and below 1.0%", () => {
    expect(evaluatePaceLevel(0.5)).toBe("recommended");
    expect(evaluatePaceLevel(0.99)).toBe("recommended");
  });

  it("returns fast from 1.0% and below 1.5%", () => {
    expect(evaluatePaceLevel(1.0)).toBe("fast");
    expect(evaluatePaceLevel(1.49)).toBe("fast");
  });

  it("returns too_fast from 1.5%", () => {
    expect(evaluatePaceLevel(1.5)).toBe("too_fast");
  });

  it("returns null for invalid values", () => {
    expect(evaluatePaceLevel(Number.NaN)).toBeNull();
    expect(evaluatePaceLevel(-1)).toBeNull();
  });
});
