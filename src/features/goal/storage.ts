import { STORAGE_KEYS } from "@/lib/constants";
import { isValidDateString } from "@/lib/date";
import { logger } from "@/lib/logger";

import type { GoalSetting } from "./types";

export function getGoalSetting(): GoalSetting | null {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEYS.GOAL_SETTING);

    if (rawValue === null) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isGoalSetting(parsedValue)) {
      logger.warn("invalid_goal_setting_storage", {
        storageKey: STORAGE_KEYS.GOAL_SETTING
      });

      return null;
    }

    return parsedValue;
  } catch (error) {
    logger.warn("failed_to_load_goal_setting", {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });
    logger.error("goal_setting_storage_error", error, {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });

    return null;
  }
}

export function saveGoalSetting(goalSetting: GoalSetting): GoalSetting | null {
  if (!isGoalSetting(goalSetting)) {
    logger.warn("invalid_goal_setting_save_input", {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });

    return null;
  }

  try {
    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify(goalSetting)
    );
  } catch (error) {
    logger.error("failed_to_save_goal_setting", error, {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });

    throw error;
  }

  return goalSetting;
}

export function clearGoalSetting(): null {
  try {
    localStorage.removeItem(STORAGE_KEYS.GOAL_SETTING);
  } catch (error) {
    logger.error("failed_to_clear_goal_setting", error, {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });
  }

  return null;
}

function isGoalSetting(value: unknown): value is GoalSetting {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const goalSetting = value as Partial<GoalSetting>;

  return (
    isOptionalFiniteNumber(goalSetting.currentWeightKg) &&
    isOptionalFiniteNumber(goalSetting.startWeightKg) &&
    isOptionalFiniteNumber(goalSetting.targetWeightKg) &&
    isOptionalDateString(goalSetting.startDate) &&
    isOptionalDateString(goalSetting.targetDate) &&
    isOptionalFiniteNumber(goalSetting.heightCm)
  );
}

function isOptionalFiniteNumber(value: unknown): boolean {
  return value === undefined || (typeof value === "number" && Number.isFinite(value));
}

function isOptionalDateString(value: unknown): boolean {
  return value === undefined || (typeof value === "string" && isValidDateString(value));
}
