export type PaceLevel = "slow" | "recommended" | "fast" | "too_fast";

export type SimulationResult = {
  totalLossKg: number;
  days: number;
  dailyLossKg: number;
  weeklyLossKg: number;
  monthlyLossKg: number;
  weeklyLossRatePercent: number;
  paceLevel: PaceLevel;
  message: string;
};
