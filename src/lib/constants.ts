export const MIN_WEIGHT_KG = 0;
export const MAX_WEIGHT_KG = 300;
export const WEIGHT_DECIMAL_PLACES = 1;

export const MAX_MEMO_LENGTH = 500;

export const DAYS_PER_WEEK = 7;
export const DAYS_PER_MONTH = 30;

export const HEALTHY_WEEKLY_LOSS_RATE_PERCENT = {
  SLOW_MAX: 0.5,
  RECOMMENDED_MAX: 1.0,
  FAST_MAX: 1.5
} as const;

export const DATE_FORMAT = "YYYY-MM-DD";
export const DISPLAY_DATE_FORMAT = "YYYY/MM/DD";
export const JAPAN_TIME_ZONE = "Asia/Tokyo";

export const STORAGE_KEYS = {
  WEIGHT_RECORDS: "weight-app:weight-records",
  GOAL_SETTING: "weight-app:goal-setting"
} as const;
