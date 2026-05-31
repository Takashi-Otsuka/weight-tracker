import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

import { WeightRecordRegistrationForm } from "./WeightRecordRegistrationForm";

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
  vi.mocked(logger.error).mockClear();
});

describe("WeightRecordRegistrationForm", () => {
  it("saves a weight record on submit", async () => {
    const user = userEvent.setup();

    render(<WeightRecordRegistrationForm />);

    await user.clear(screen.getByLabelText("日付"));
    await user.type(screen.getByLabelText("日付"), "2026-05-30");
    await user.type(screen.getByLabelText("体重"), "80.1");
    await user.type(screen.getByLabelText("メモ"), "朝食前");
    await user.click(screen.getByRole("button", { name: "記録する" }));

    await waitFor(() => {
      expect(screen.getByText("保存しました")).toBeInTheDocument();
    });

    const records = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS)!
    );

    expect(records).toMatchObject([
      {
        date: "2026-05-30",
        weightKg: 80.1,
        memo: "朝食前"
      }
    ]);
    expect(records[0].id).toEqual(expect.any(String));
    expect(records[0].createdAt).toEqual(expect.any(String));
    expect(records[0].updatedAt).toEqual(expect.any(String));
  });

  it("shows a storage error when saving fails", async () => {
    const user = userEvent.setup();
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    render(<WeightRecordRegistrationForm />);

    await user.clear(screen.getByLabelText("日付"));
    await user.type(screen.getByLabelText("日付"), "2026-05-30");
    await user.type(screen.getByLabelText("体重"), "80.1");
    await user.click(screen.getByRole("button", { name: "記録する" }));

    await waitFor(() => {
      expect(
        screen.getByText("体重記録の保存に失敗しました")
      ).toBeInTheDocument();
    });

    expect(logger.error).toHaveBeenCalledWith(
      "failed_to_register_weight_record",
      expect.any(Error),
      {
        action: "register_weight_record",
        result: "failed"
      }
    );

    setItem.mockRestore();
  });
});
