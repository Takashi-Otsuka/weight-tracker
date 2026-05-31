import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

import {
  registerGoalSetting,
  type RegisterGoalSettingInput
} from "./registration";

vi.mock("@/lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

beforeEach(() => {
  localStorage.clear();
  vi.mocked(logger.info).mockClear();
  vi.mocked(logger.warn).mockClear();
  vi.mocked(logger.error).mockClear();
});

describe("registerGoalSetting", () => {
  it("creates and saves a goal setting", () => {
    const result = registerGoalSetting({
      currentWeightKg: 80.1,
      targetWeightKg: 75,
      targetDate: "2026-06-30"
    });

    const expectedGoalSetting = {
      currentWeightKg: 80.1,
      targetWeightKg: 75,
      targetDate: "2026-06-30"
    };

    expect(result).toEqual({
      isSuccess: true,
      goalSetting: expectedGoalSetting
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.GOAL_SETTING)!)).toEqual(
      expectedGoalSetting
    );
    expect(logger.info).toHaveBeenCalledWith("goal_setting_registered", {
      action: "register_goal_setting",
      result: "success"
    });
  });

  it("updates a stored goal setting", () => {
    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify({
        currentWeightKg: 80.1,
        targetWeightKg: 75,
        targetDate: "2026-06-30"
      })
    );

    const result = registerGoalSetting({
      currentWeightKg: 79.8,
      targetWeightKg: 74,
      targetDate: "2026-07-31"
    });

    const expectedGoalSetting = {
      currentWeightKg: 79.8,
      targetWeightKg: 74,
      targetDate: "2026-07-31"
    };

    expect(result).toEqual({
      isSuccess: true,
      goalSetting: expectedGoalSetting
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.GOAL_SETTING)!)).toEqual(
      expectedGoalSetting
    );
  });

  it("returns a storage error message and logs when saving fails", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    expect(
      registerGoalSetting({
        currentWeightKg: 80.1,
        targetWeightKg: 75,
        targetDate: "2026-06-30"
      })
    ).toEqual({
      isSuccess: false,
      message: "目標設定の保存に失敗しました"
    });
    expect(logger.error).toHaveBeenCalledWith(
      "failed_to_register_goal_setting",
      expect.any(Error),
      {
        action: "register_goal_setting",
        result: "failed"
      }
    );

    setItem.mockRestore();
  });

  it("returns a storage error message when storage rejects the goal setting", () => {
    const invalidInput = {
      currentWeightKg: 80.1,
      targetWeightKg: 75,
      targetDate: "invalid"
    } as unknown as RegisterGoalSettingInput;

    expect(registerGoalSetting(invalidInput)).toEqual({
      isSuccess: false,
      message: "目標設定の保存に失敗しました"
    });
    expect(logger.warn).toHaveBeenCalledWith(
      "invalid_goal_setting_registration_input",
      {
        action: "register_goal_setting",
        result: "failed"
      }
    );
  });
});
