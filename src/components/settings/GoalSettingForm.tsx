"use client";

import { useState } from "react";

import { validateDate, validateTargetWeight } from "@/lib/validation";

export type GoalSettingFormValue = {
  currentWeightKg: number;
  targetWeightKg: number;
  targetDate: string;
};

export type GoalSettingFormInitialValue = Partial<GoalSettingFormValue>;

export type GoalSettingFormSubmitResult =
  | void
  | {
      isSuccess: true;
    }
  | {
      isSuccess: false;
      message: string;
    };

export type GoalSettingFormProps = {
  initialValue?: GoalSettingFormInitialValue;
  onSubmit: (
    value: GoalSettingFormValue
  ) => GoalSettingFormSubmitResult | Promise<GoalSettingFormSubmitResult>;
};

type GoalSettingField =
  | "currentWeightKg"
  | "targetWeightKg"
  | "targetDate"
  | "form";
type GoalSettingErrors = Partial<Record<GoalSettingField, string>>;

export function GoalSettingForm({
  initialValue,
  onSubmit
}: GoalSettingFormProps) {
  const [currentWeightKg, setCurrentWeightKg] = useState(
    initialValue?.currentWeightKg?.toString() ?? ""
  );
  const [targetWeightKg, setTargetWeightKg] = useState(
    initialValue?.targetWeightKg?.toString() ?? ""
  );
  const [targetDate, setTargetDate] = useState(initialValue?.targetDate ?? "");
  const [errors, setErrors] = useState<GoalSettingErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    const nextErrors: GoalSettingErrors = {};
    const weightResult = validateTargetWeight({
      currentWeightKg,
      targetWeightKg
    });
    const targetDateResult = validateDate(targetDate);

    if (!weightResult.isValid) {
      for (const error of weightResult.errors) {
        if (
          error.field === "currentWeightKg" ||
          error.field === "targetWeightKg"
        ) {
          nextErrors[error.field] = error.message;
        }
      }
    }

    if (!targetDateResult.isValid) {
      nextErrors.targetDate = targetDateResult.errors[0]?.message;
    }

    setErrors(nextErrors);

    if (!weightResult.isValid || !targetDateResult.isValid) {
      return;
    }

    const result = await onSubmit({
      ...weightResult.value,
      targetDate: targetDateResult.value
    });

    if (result?.isSuccess === false) {
      setErrors({
        form: result.message
      });
      return;
    }

    setErrors({});
    setSuccessMessage("保存しました");
  }

  return (
    <form
      aria-label="目標設定フォーム"
      className="flex w-full flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
      noValidate
      onSubmit={handleSubmit}
    >
      {errors.form ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.form}
        </p>
      ) : null}
      {successMessage ? (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-zinc-900"
          htmlFor="currentWeightKg"
        >
          現在体重
        </label>
        <div className="flex items-center rounded-md border border-zinc-300 bg-white focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-200">
          <input
            id="currentWeightKg"
            name="currentWeightKg"
            type="number"
            inputMode="decimal"
            min="0"
            max="300"
            step="0.1"
            value={currentWeightKg}
            aria-invalid={
              errors.currentWeightKg === undefined ? undefined : true
            }
            aria-describedby={
              errors.currentWeightKg ? "currentWeightKg-error" : undefined
            }
            className="h-11 min-w-0 flex-1 rounded-md px-3 text-base text-zinc-900 outline-none"
            onChange={(event) => setCurrentWeightKg(event.target.value)}
          />
          <span className="pr-3 text-sm font-medium text-zinc-500">kg</span>
        </div>
        {errors.currentWeightKg ? (
          <p className="text-sm text-red-600" id="currentWeightKg-error">
            {errors.currentWeightKg}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-zinc-900"
          htmlFor="targetWeightKg"
        >
          目標体重
        </label>
        <div className="flex items-center rounded-md border border-zinc-300 bg-white focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-200">
          <input
            id="targetWeightKg"
            name="targetWeightKg"
            type="number"
            inputMode="decimal"
            min="0"
            max="300"
            step="0.1"
            value={targetWeightKg}
            aria-invalid={errors.targetWeightKg === undefined ? undefined : true}
            aria-describedby={
              errors.targetWeightKg ? "targetWeightKg-error" : undefined
            }
            className="h-11 min-w-0 flex-1 rounded-md px-3 text-base text-zinc-900 outline-none"
            onChange={(event) => setTargetWeightKg(event.target.value)}
          />
          <span className="pr-3 text-sm font-medium text-zinc-500">kg</span>
        </div>
        {errors.targetWeightKg ? (
          <p className="text-sm text-red-600" id="targetWeightKg-error">
            {errors.targetWeightKg}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-zinc-900"
          htmlFor="targetDate"
        >
          目標日
        </label>
        <input
          id="targetDate"
          name="targetDate"
          type="date"
          value={targetDate}
          aria-invalid={errors.targetDate === undefined ? undefined : true}
          aria-describedby={errors.targetDate ? "targetDate-error" : undefined}
          className="h-11 rounded-md border border-zinc-300 px-3 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
          onChange={(event) => setTargetDate(event.target.value)}
        />
        {errors.targetDate ? (
          <p className="text-sm text-red-600" id="targetDate-error">
            {errors.targetDate}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="h-11 rounded-md bg-zinc-900 px-4 text-base font-semibold text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
      >
        目標を設定する
      </button>
    </form>
  );
}
