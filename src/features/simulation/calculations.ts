import {
  DAYS_PER_MONTH,
  DAYS_PER_WEEK,
  HEALTHY_WEEKLY_LOSS_RATE_PERCENT
} from "@/lib/constants";
import { getToday, parseDate } from "@/lib/date";

import type { PaceLevel, SimulationResult } from "./types";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const PACE_MESSAGES: Record<PaceLevel, string> = {
  slow: "ゆるやかなペースです",
  recommended: "無理の少ないペースです",
  fast: "やや速いペースです",
  too_fast: "目標期間の見直しをおすすめします"
};

export type SimulationByDateInput = {
  currentWeightKg: number;
  targetWeightKg: number;
  targetDate: string;
  today?: string;
};

export type SimulationByPaceInput = {
  currentWeightKg: number;
  targetWeightKg: number;
  dailyLossKg: number;
  today?: string;
};

export type SimulationByPaceResult = SimulationResult & {
  estimatedTargetDate: string;
};

export function calculateSimulationByDate(
  input: SimulationByDateInput
): SimulationResult | null {
  const totalLossKg = calculateTotalLossKg(
    input.currentWeightKg,
    input.targetWeightKg
  );

  if (totalLossKg === null) {
    return null;
  }

  const today = input.today ?? getToday();
  const days = calculateDaysBetween(today, input.targetDate);

  if (days === null || days <= 0) {
    return null;
  }

  return buildSimulationResult({
    currentWeightKg: input.currentWeightKg,
    totalLossKg,
    days,
    dailyLossKg: totalLossKg / days
  });
}

export function calculateSimulationByPace(
  input: SimulationByPaceInput
): SimulationByPaceResult | null {
  const totalLossKg = calculateTotalLossKg(
    input.currentWeightKg,
    input.targetWeightKg
  );

  if (totalLossKg === null || !isPositiveFiniteNumber(input.dailyLossKg)) {
    return null;
  }

  const today = input.today ?? getToday();
  const estimatedTargetDate = addDays(today, Math.ceil(totalLossKg / input.dailyLossKg));

  if (estimatedTargetDate === null) {
    return null;
  }

  const days = Math.ceil(totalLossKg / input.dailyLossKg);

  return {
    ...buildSimulationResult({
      currentWeightKg: input.currentWeightKg,
      totalLossKg,
      days,
      dailyLossKg: input.dailyLossKg
    }),
    estimatedTargetDate
  };
}

export function evaluatePaceLevel(weeklyLossRatePercent: number): PaceLevel | null {
  if (!Number.isFinite(weeklyLossRatePercent) || weeklyLossRatePercent < 0) {
    return null;
  }

  if (weeklyLossRatePercent < HEALTHY_WEEKLY_LOSS_RATE_PERCENT.SLOW_MAX) {
    return "slow";
  }

  if (weeklyLossRatePercent < HEALTHY_WEEKLY_LOSS_RATE_PERCENT.RECOMMENDED_MAX) {
    return "recommended";
  }

  if (weeklyLossRatePercent < HEALTHY_WEEKLY_LOSS_RATE_PERCENT.FAST_MAX) {
    return "fast";
  }

  return "too_fast";
}

function buildSimulationResult(input: {
  currentWeightKg: number;
  totalLossKg: number;
  days: number;
  dailyLossKg: number;
}): SimulationResult {
  const weeklyLossKg = input.dailyLossKg * DAYS_PER_WEEK;
  const monthlyLossKg = input.dailyLossKg * DAYS_PER_MONTH;
  const weeklyLossRatePercent = (weeklyLossKg / input.currentWeightKg) * 100;
  const paceLevel = evaluatePaceLevel(weeklyLossRatePercent)!;

  return {
    totalLossKg: input.totalLossKg,
    days: input.days,
    dailyLossKg: input.dailyLossKg,
    weeklyLossKg,
    monthlyLossKg,
    weeklyLossRatePercent,
    paceLevel,
    message: PACE_MESSAGES[paceLevel]
  };
}

function calculateTotalLossKg(
  currentWeightKg: number,
  targetWeightKg: number
): number | null {
  if (!isPositiveFiniteNumber(currentWeightKg) || !isPositiveFiniteNumber(targetWeightKg)) {
    return null;
  }

  const totalLossKg = currentWeightKg - targetWeightKg;

  return totalLossKg > 0 ? totalLossKg : null;
}

function calculateDaysBetween(startDate: string, endDate: string): number | null {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (start === null || end === null) {
    return null;
  }

  return Math.ceil((end.getTime() - start.getTime()) / MILLISECONDS_PER_DAY);
}

function addDays(date: string, days: number): string | null {
  const parsedDate = parseDate(date);

  if (parsedDate === null || !Number.isInteger(days) || days <= 0) {
    return null;
  }

  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}

function isPositiveFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}
