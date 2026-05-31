import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

import { WeightRecordsSection } from "./WeightRecordsSection";

import type { WeightRecord } from "@/features/weight/types";

vi.mock("@/lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

const savedRecord: WeightRecord = {
  id: "record-1",
  date: "2026-05-30",
  weightKg: 80.1,
  memo: "朝食前",
  createdAt: "2026-05-30T00:00:00.000Z",
  updatedAt: "2026-05-30T00:00:00.000Z"
};

beforeEach(() => {
  localStorage.clear();
  vi.mocked(logger.warn).mockClear();
  vi.mocked(logger.error).mockClear();
});

describe("WeightRecordsSection", () => {
  it("loads weight records on initial render", async () => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, JSON.stringify([savedRecord]));

    render(<WeightRecordsSection />);

    expect(await screen.findByText("2026/05/30")).toBeInTheDocument();
    expect(screen.getByText("80.1")).toBeInTheDocument();
    expect(screen.getByText("朝食前")).toBeInTheDocument();
  });

  it("reloads weight records after successful registration", async () => {
    const user = userEvent.setup();

    render(<WeightRecordsSection />);

    expect(screen.getByText("まだ体重記録がありません")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("日付"));
    await user.type(screen.getByLabelText("日付"), "2026-05-31");
    await user.type(screen.getByLabelText("体重"), "79.9");
    await user.type(screen.getByLabelText("メモ"), "夕食前");
    await user.click(screen.getByRole("button", { name: "記録する" }));

    await waitFor(() => {
      expect(screen.getByText("保存しました")).toBeInTheDocument();
    });

    const items = screen.getAllByRole("listitem");

    expect(within(items[0]).getByText("2026/05/31")).toBeInTheDocument();
    expect(within(items[0]).getByText("79.9")).toBeInTheDocument();
    expect(within(items[0]).getByText("夕食前")).toBeInTheDocument();
  });
});
