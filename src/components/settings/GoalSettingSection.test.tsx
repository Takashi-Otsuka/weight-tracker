import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

import { GoalSettingSection } from "./GoalSettingSection";

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

describe("GoalSettingSection", () => {
  it("loads stored goal setting on initial render", async () => {
    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify({
        currentWeightKg: 80.1,
        targetWeightKg: 75,
        targetDate: "2026-06-30"
      })
    );

    render(<GoalSettingSection />);

    await waitFor(() => {
      expect(screen.getByLabelText("現在体重")).toHaveValue(80.1);
    });
    expect(screen.getByLabelText("目標体重")).toHaveValue(75);
    expect(screen.getByLabelText("目標日")).toHaveValue("2026-06-30");
  });

  it("saves a goal setting", async () => {
    const user = userEvent.setup();

    render(<GoalSettingSection />);

    await user.type(await screen.findByLabelText("現在体重"), "80.1");
    await user.type(screen.getByLabelText("目標体重"), "75.0");
    await user.type(screen.getByLabelText("目標日"), "2026-06-30");
    await user.click(screen.getByRole("button", { name: "目標を設定する" }));

    await waitFor(() => {
      expect(screen.getByText("保存しました")).toBeInTheDocument();
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.GOAL_SETTING)!)).toEqual(
      {
        currentWeightKg: 80.1,
        targetWeightKg: 75,
        targetDate: "2026-06-30"
      }
    );
  });

  it("updates a stored goal setting", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      STORAGE_KEYS.GOAL_SETTING,
      JSON.stringify({
        currentWeightKg: 80.1,
        targetWeightKg: 75,
        targetDate: "2026-06-30"
      })
    );

    render(<GoalSettingSection />);

    await waitFor(() => {
      expect(screen.getByLabelText("現在体重")).toHaveValue(80.1);
    });

    await user.clear(screen.getByLabelText("現在体重"));
    await user.type(screen.getByLabelText("現在体重"), "79.8");
    await user.clear(screen.getByLabelText("目標体重"));
    await user.type(screen.getByLabelText("目標体重"), "74.0");
    await user.clear(screen.getByLabelText("目標日"));
    await user.type(screen.getByLabelText("目標日"), "2026-07-31");
    await user.click(screen.getByRole("button", { name: "目標を設定する" }));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.GOAL_SETTING)!)).toEqual(
        {
          currentWeightKg: 79.8,
          targetWeightKg: 74,
          targetDate: "2026-07-31"
        }
      );
    });
  });

  it("shows validation errors and does not save invalid values", async () => {
    const user = userEvent.setup();

    render(<GoalSettingSection />);

    await user.type(await screen.findByLabelText("現在体重"), "75.0");
    await user.type(screen.getByLabelText("目標体重"), "75.0");
    await user.type(screen.getByLabelText("目標日"), "2026-06-30");
    await user.click(screen.getByRole("button", { name: "目標を設定する" }));

    expect(
      screen.getByText("目標体重は現在体重より小さい値を入力してください")
    ).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEYS.GOAL_SETTING)).toBeNull();
  });
});
