"use client";

import { useState } from "react";

import { MAX_MEMO_LENGTH } from "@/lib/constants";
import { getToday } from "@/lib/date";
import { validateDate, validateWeight } from "@/lib/validation";

export type WeightInputFormValue = {
  date: string;
  weightKg: number;
  memo?: string;
};

export type WeightInputFormSubmitResult =
  | void
  | {
      isSuccess: true;
    }
  | {
      isSuccess: false;
      message: string;
    };

export type WeightInputFormProps = {
  initialDate?: string;
  onSubmit: (
    value: WeightInputFormValue
  ) => WeightInputFormSubmitResult | Promise<WeightInputFormSubmitResult>;
};

type WeightInputField = "date" | "weightKg" | "memo" | "form";
type WeightInputErrors = Partial<Record<WeightInputField, string>>;

export function WeightInputForm({
  initialDate = getToday(),
  onSubmit
}: WeightInputFormProps) {
  const [date, setDate] = useState(initialDate);
  const [weightKg, setWeightKg] = useState("");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<WeightInputErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    const nextErrors: WeightInputErrors = {};
    const dateResult = validateDate(date);
    const weightResult = validateWeight(weightKg);
    const normalizedMemo = memo.trim();

    if (!dateResult.isValid) {
      nextErrors.date = dateResult.errors[0]?.message;
    }

    if (!weightResult.isValid) {
      nextErrors.weightKg = weightResult.errors[0]?.message;
    }

    if (normalizedMemo.length > MAX_MEMO_LENGTH) {
      nextErrors.memo = `メモは${MAX_MEMO_LENGTH}文字以内で入力してください`;
    }

    setErrors(nextErrors);

    if (!dateResult.isValid || !weightResult.isValid || nextErrors.memo) {
      return;
    }

    const result = await onSubmit({
      date: dateResult.value,
      weightKg: weightResult.value,
      memo: normalizedMemo === "" ? undefined : normalizedMemo
    });

    if (result?.isSuccess === false) {
      setErrors({
        form: result.message
      });
      return;
    }

    setWeightKg("");
    setMemo("");
    setErrors({});
    setSuccessMessage("保存しました");
  }

  return (
    <form
      aria-label="体重記録フォーム"
      className="flex w-full flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
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
        <label className="text-sm font-medium text-zinc-900" htmlFor="date">
          日付
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={date}
          aria-invalid={errors.date === undefined ? undefined : true}
          aria-describedby={errors.date ? "date-error" : undefined}
          className="h-11 rounded-md border border-zinc-300 px-3 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
          onChange={(event) => setDate(event.target.value)}
        />
        {errors.date ? (
          <p className="text-sm text-red-600" id="date-error">
            {errors.date}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-zinc-900"
          htmlFor="weightKg"
        >
          体重
        </label>
        <div className="flex items-center rounded-md border border-zinc-300 bg-white focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-200">
          <input
            id="weightKg"
            name="weightKg"
            type="number"
            inputMode="decimal"
            min="0"
            max="300"
            step="0.1"
            value={weightKg}
            aria-invalid={errors.weightKg === undefined ? undefined : true}
            aria-describedby={errors.weightKg ? "weightKg-error" : undefined}
            className="h-11 min-w-0 flex-1 rounded-md px-3 text-base text-zinc-900 outline-none"
            onChange={(event) => setWeightKg(event.target.value)}
          />
          <span className="pr-3 text-sm font-medium text-zinc-500">kg</span>
        </div>
        {errors.weightKg ? (
          <p className="text-sm text-red-600" id="weightKg-error">
            {errors.weightKg}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-900" htmlFor="memo">
          メモ
        </label>
        <textarea
          id="memo"
          name="memo"
          rows={3}
          maxLength={MAX_MEMO_LENGTH + 1}
          value={memo}
          aria-invalid={errors.memo === undefined ? undefined : true}
          aria-describedby={errors.memo ? "memo-error" : undefined}
          className="resize-none rounded-md border border-zinc-300 px-3 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
          onChange={(event) => setMemo(event.target.value)}
        />
        {errors.memo ? (
          <p className="text-sm text-red-600" id="memo-error">
            {errors.memo}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="h-11 rounded-md bg-zinc-900 px-4 text-base font-semibold text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
      >
        記録する
      </button>
    </form>
  );
}
