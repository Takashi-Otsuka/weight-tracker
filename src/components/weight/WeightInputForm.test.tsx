import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WeightInputForm } from "./WeightInputForm";

describe("WeightInputForm", () => {
  it("shows the initial date", () => {
    render(<WeightInputForm initialDate="2026-05-30" onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("日付")).toHaveValue("2026-05-30");
  });

  it("allows weight, date, and memo input", async () => {
    const user = userEvent.setup();

    render(<WeightInputForm initialDate="2026-05-30" onSubmit={vi.fn()} />);

    await user.clear(screen.getByLabelText("日付"));
    await user.type(screen.getByLabelText("日付"), "2026-05-31");
    await user.type(screen.getByLabelText("体重"), "80.1");
    await user.type(screen.getByLabelText("メモ"), "朝食前");

    expect(screen.getByLabelText("日付")).toHaveValue("2026-05-31");
    expect(screen.getByLabelText("体重")).toHaveValue(80.1);
    expect(screen.getByLabelText("メモ")).toHaveValue("朝食前");
  });

  it("submits validated values", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn(() => ({ isSuccess: true as const }));

    render(
      <WeightInputForm initialDate="2026-05-30" onSubmit={handleSubmit} />
    );

    await user.type(screen.getByLabelText("体重"), "80.1");
    await user.type(screen.getByLabelText("メモ"), " 朝食前 ");
    await user.click(screen.getByRole("button", { name: "記録する" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      date: "2026-05-30",
      weightKg: 80.1,
      memo: "朝食前"
    });
    expect(screen.getByText("保存しました")).toBeInTheDocument();
    expect(screen.getByLabelText("体重")).toHaveValue(null);
    expect(screen.getByLabelText("メモ")).toHaveValue("");
  });

  it("submits without memo when memo is empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <WeightInputForm initialDate="2026-05-30" onSubmit={handleSubmit} />
    );

    await user.type(screen.getByLabelText("体重"), "80.1");
    await user.click(screen.getByRole("button", { name: "記録する" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      date: "2026-05-30",
      weightKg: 80.1,
      memo: undefined
    });
  });

  it("shows a weight validation error", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <WeightInputForm initialDate="2026-05-30" onSubmit={handleSubmit} />
    );

    await user.click(screen.getByRole("button", { name: "記録する" }));

    expect(screen.getByText("数値を入力してください")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows a date validation error", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<WeightInputForm initialDate="" onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("体重"), "80.1");
    await user.click(screen.getByRole("button", { name: "記録する" }));

    expect(screen.getByText("日付を入力してください")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows a memo validation error", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const longMemo = "a".repeat(501);

    render(
      <WeightInputForm initialDate="2026-05-30" onSubmit={handleSubmit} />
    );

    await user.type(screen.getByLabelText("体重"), "80.1");
    fireEvent.change(screen.getByLabelText("メモ"), {
      target: { value: longMemo }
    });
    await user.click(screen.getByRole("button", { name: "記録する" }));

    expect(
      screen.getByText("メモは500文字以内で入力してください")
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows a submit error", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn(() => ({
      isSuccess: false as const,
      message: "体重記録の保存に失敗しました"
    }));

    render(
      <WeightInputForm initialDate="2026-05-30" onSubmit={handleSubmit} />
    );

    await user.type(screen.getByLabelText("体重"), "80.1");
    await user.click(screen.getByRole("button", { name: "記録する" }));

    expect(
      screen.getByText("体重記録の保存に失敗しました")
    ).toBeInTheDocument();
  });
});
