import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WeightRecordList } from "./WeightRecordList";

import type { WeightRecord } from "@/features/weight/types";

const firstRecord: WeightRecord = {
  id: "record-1",
  date: "2026-05-30",
  weightKg: 80.1,
  memo: "朝食前",
  createdAt: "2026-05-30T00:00:00.000Z",
  updatedAt: "2026-05-30T00:00:00.000Z"
};

const secondRecord: WeightRecord = {
  id: "record-2",
  date: "2026-05-31",
  weightKg: 79.9,
  createdAt: "2026-05-31T00:00:00.000Z",
  updatedAt: "2026-05-31T00:00:00.000Z"
};

describe("WeightRecordList", () => {
  it("shows an empty state", () => {
    render(<WeightRecordList records={[]} />);

    expect(screen.getByLabelText("体重記録一覧")).toBeInTheDocument();
    expect(screen.getByText("まだ体重記録がありません")).toBeInTheDocument();
    expect(
      screen.getByText("体重を入力すると、ここに記録が表示されます。")
    ).toBeInTheDocument();
  });

  it("shows date, weight, and memo", () => {
    render(<WeightRecordList records={[firstRecord]} />);

    expect(screen.getByText("2026/05/30")).toBeInTheDocument();
    expect(screen.getByText("80.1")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
    expect(screen.getByText("朝食前")).toBeInTheDocument();
  });

  it("does not show memo text when memo is empty", () => {
    render(<WeightRecordList records={[secondRecord]} />);

    expect(screen.getByText("2026/05/31")).toBeInTheDocument();
    expect(screen.getByText("79.9")).toBeInTheDocument();
    expect(screen.queryByText("朝食前")).not.toBeInTheDocument();
  });

  it("shows records in descending date order", () => {
    render(<WeightRecordList records={[firstRecord, secondRecord]} />);

    const items = screen.getAllByRole("listitem");

    expect(within(items[0]).getByText("2026/05/31")).toBeInTheDocument();
    expect(within(items[0]).getByText("79.9")).toBeInTheDocument();
    expect(within(items[1]).getByText("2026/05/30")).toBeInTheDocument();
    expect(within(items[1]).getByText("80.1")).toBeInTheDocument();
  });
});
