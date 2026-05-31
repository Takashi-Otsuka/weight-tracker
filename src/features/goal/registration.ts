import { logger } from "@/lib/logger";

import { saveGoalSetting } from "./storage";

import type { GoalSetting } from "./types";

export type RegisterGoalSettingInput = {
  currentWeightKg: number;
  targetWeightKg: number;
  targetDate: string;
};

export type RegisterGoalSettingSuccess = {
  isSuccess: true;
  goalSetting: GoalSetting;
};

export type RegisterGoalSettingFailure = {
  isSuccess: false;
  message: string;
};

export type RegisterGoalSettingResult =
  | RegisterGoalSettingSuccess
  | RegisterGoalSettingFailure;

const STORAGE_ERROR_MESSAGE = "目標設定の保存に失敗しました";

export function registerGoalSetting(
  input: RegisterGoalSettingInput
): RegisterGoalSettingResult {
  const goalSetting: GoalSetting = {
    currentWeightKg: input.currentWeightKg,
    targetWeightKg: input.targetWeightKg,
    targetDate: input.targetDate
  };

  try {
    const savedGoalSetting = saveGoalSetting(goalSetting);

    if (savedGoalSetting === null) {
      logger.warn("invalid_goal_setting_registration_input", {
        action: "register_goal_setting",
        result: "failed"
      });

      return {
        isSuccess: false,
        message: STORAGE_ERROR_MESSAGE
      };
    }

    logger.info("goal_setting_registered", {
      action: "register_goal_setting",
      result: "success"
    });

    return {
      isSuccess: true,
      goalSetting: savedGoalSetting
    };
  } catch (error) {
    logger.error("failed_to_register_goal_setting", error, {
      action: "register_goal_setting",
      result: "failed"
    });

    return {
      isSuccess: false,
      message: STORAGE_ERROR_MESSAGE
    };
  }
}
