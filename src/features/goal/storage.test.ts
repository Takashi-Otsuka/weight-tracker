import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

import {
  clearGoalSetting,
  getGoalSetting,
  saveGoalSetting
} from "./storage";

import type { GoalSetting } from "./types";

vi.mock("@/lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

const goalSetting: GoalSetting = {
  currentWeightKg: 80,
  startWeightKg: 82,
  targetWeightKg: 75,
  startDate: "2026-05-30",
  targetDate: "2026-08-30",
  heightCm: 170
};

beforeEach(() => {
  localStorage.clear();
  vi.mocked(logger.warn).mockClear();
  vi.mocked(logger.error).mockClear();
});

describe("getGoalSetting", () => {
  it("returns null when goal setting is not set", () => {
    expect(getGoalSetting()).toBeNull();
  });

  it("returns stored goal setting", () => {
    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify(goalSetting)
    );

    expect(getGoalSetting()).toEqual(goalSetting);
  });

  it("returns stored partial goal setting", () => {
    const partialGoalSetting: GoalSetting = {
      targetWeightKg: 75
    };

    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify(partialGoalSetting)
    );

    expect(getGoalSetting()).toEqual(partialGoalSetting);
  });

  it("returns null and logs when JSON is corrupted", () => {
    localStorage.setItem(STORAGE_KEYS.GOAL_SETTING, "{");

    expect(getGoalSetting()).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith("failed_to_load_goal_setting", {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });
    expect(logger.error).toHaveBeenCalledWith(
      "goal_setting_storage_error",
      expect.any(Object),
      {
        storageKey: STORAGE_KEYS.GOAL_SETTING
      }
    );
  });

  it("returns null and logs when stored value is not an object", () => {
    localStorage.setItem(STORAGE_KEYS.GOAL_SETTING, JSON.stringify(null));

    expect(getGoalSetting()).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith("invalid_goal_setting_storage", {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });
  });

  it("returns null and logs when stored value is an array", () => {
    localStorage.setItem(STORAGE_KEYS.GOAL_SETTING, JSON.stringify([]));

    expect(getGoalSetting()).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith("invalid_goal_setting_storage", {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });
  });

  it("returns null and logs when stored number is invalid", () => {
    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify({ targetWeightKg: Number.NaN })
    );

    expect(getGoalSetting()).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith("invalid_goal_setting_storage", {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });
  });

  it("returns null and logs when stored date is invalid", () => {
    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify({ targetDate: "2026/08/30" })
    );

    expect(getGoalSetting()).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith("invalid_goal_setting_storage", {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });
  });
});

describe("saveGoalSetting", () => {
  it("saves goal setting", () => {
    expect(saveGoalSetting(goalSetting)).toEqual(goalSetting);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.GOAL_SETTING)!)).toEqual(
      goalSetting
    );
  });

  it("saves an empty goal setting for unset state", () => {
    expect(saveGoalSetting({})).toEqual({});
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.GOAL_SETTING)!)).toEqual(
      {}
    );
  });

  it("returns null and logs when input is invalid", () => {
    expect(
      saveGoalSetting({
        targetDate: "invalid"
      })
    ).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith("invalid_goal_setting_save_input", {
      storageKey: STORAGE_KEYS.GOAL_SETTING
    });
  });

  it("logs and returns goal setting when saving fails", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    expect(saveGoalSetting(goalSetting)).toEqual(goalSetting);
    expect(logger.error).toHaveBeenCalledWith(
      "failed_to_save_goal_setting",
      expect.any(Error),
      {
        storageKey: STORAGE_KEYS.GOAL_SETTING
      }
    );

    setItem.mockRestore();
  });
});

describe("clearGoalSetting", () => {
  it("removes stored goal setting", () => {
    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify(goalSetting)
    );

    expect(clearGoalSetting()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.GOAL_SETTING)).toBeNull();
  });

  it("logs and returns null when clearing fails", () => {
    const removeItem = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {
        throw new Error("storage unavailable");
      });

    expect(clearGoalSetting()).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      "failed_to_clear_goal_setting",
      expect.any(Error),
      {
        storageKey: STORAGE_KEYS.GOAL_SETTING
      }
    );

    removeItem.mockRestore();
  });
});
