"use client";

import { useEffect, useState } from "react";

import { registerGoalSetting } from "@/features/goal/registration";
import { getGoalSetting } from "@/features/goal/storage";

import {
  GoalSettingForm,
  type GoalSettingFormSubmitResult,
  type GoalSettingFormValue
} from "./GoalSettingForm";

import type { GoalSetting } from "@/features/goal/types";

type RefreshGoalSettingOptions = {
  shouldMarkLoaded?: boolean;
};

function toFormInitialValue(goalSetting: GoalSetting | null) {
  return {
    currentWeightKg: goalSetting?.currentWeightKg,
    targetWeightKg: goalSetting?.targetWeightKg,
    targetDate: goalSetting?.targetDate
  };
}

export function GoalSettingSection() {
  const [goalSetting, setGoalSetting] = useState<GoalSetting | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  function refreshGoalSetting(options: RefreshGoalSettingOptions = {}) {
    setGoalSetting(getGoalSetting());

    if (options.shouldMarkLoaded) {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => refreshGoalSetting({ shouldMarkLoaded: true }),
      0
    );

    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleSubmit(
    value: GoalSettingFormValue
  ): GoalSettingFormSubmitResult {
    const result = registerGoalSetting(value);

    if (!result.isSuccess) {
      return {
        isSuccess: false,
        message: result.message
      };
    }

    refreshGoalSetting();

    return {
      isSuccess: true
    };
  }

  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm">
        読み込み中です
      </div>
    );
  }

  return (
    <GoalSettingForm
      initialValue={toFormInitialValue(goalSetting)}
      onSubmit={handleSubmit}
    />
  );
}
