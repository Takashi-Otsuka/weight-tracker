import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GoalSettingForm } from "./GoalSettingForm";

describe("GoalSettingForm", () => {
  it("allows current weight, target weight, and target date input", async () => {
    const user = userEvent.setup();

    render(<GoalSettingForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("現在体重"), "80.1");
    await user.type(screen.getByLabelText("目標体重"), "75.0");
    await user.type(screen.getByLabelText("目標日"), "2026-06-30");

    expect(screen.getByLabelText("現在体重")).toHaveValue(80.1);
    expect(screen.getByLabelText("目標体重")).toHaveValue(75);
    expect(screen.getByLabelText("目標日")).toHaveValue("2026-06-30");
  });

  it("submits validated values", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<GoalSettingForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("現在体重"), "80.1");
    await user.type(screen.getByLabelText("目標体重"), "75.0");
    await user.type(screen.getByLabelText("目標日"), "2026-06-30");
    await user.click(screen.getByRole("button", { name: "目標を設定する" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      currentWeightKg: 80.1,
      targetWeightKg: 75,
      targetDate: "2026-06-30"
    });
  });

  it("shows required validation errors", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<GoalSettingForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: "目標を設定する" }));

    expect(screen.getAllByText("数値を入力してください")).toHaveLength(2);
    expect(screen.getByText("日付を入力してください")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows a business error when target weight is not less than current weight", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<GoalSettingForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("現在体重"), "75.0");
    await user.type(screen.getByLabelText("目標体重"), "75.0");
    await user.type(screen.getByLabelText("目標日"), "2026-06-30");
    await user.click(screen.getByRole("button", { name: "目標を設定する" }));

    expect(
      screen.getByText("目標体重は現在体重より小さい値を入力してください")
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows a weight decimal places validation error", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<GoalSettingForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("現在体重"), "80.12");
    await user.type(screen.getByLabelText("目標体重"), "75.0");
    await user.type(screen.getByLabelText("目標日"), "2026-06-30");
    await user.click(screen.getByRole("button", { name: "目標を設定する" }));

    expect(
      screen.getByText("体重は小数1桁までで入力してください")
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
