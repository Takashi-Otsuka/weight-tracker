"use client";

import {
  WeightInputForm,
  type WeightInputFormSubmitResult,
  type WeightInputFormValue
} from "./WeightInputForm";

import { registerWeightRecord } from "@/features/weight/registration";

export type WeightRecordRegistrationFormProps = {
  onSaveSuccess?: () => void;
};

export function WeightRecordRegistrationForm({
  onSaveSuccess
}: WeightRecordRegistrationFormProps) {
  function handleSubmit(
    value: WeightInputFormValue
  ): WeightInputFormSubmitResult {
    const result = registerWeightRecord(value);

    if (!result.isSuccess) {
      return {
        isSuccess: false,
        message: result.message
      };
    }

    onSaveSuccess?.();

    return {
      isSuccess: true
    };
  }

  return <WeightInputForm onSubmit={handleSubmit} />;
}
