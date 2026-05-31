"use client";

import {
  WeightInputForm,
  type WeightInputFormSubmitResult,
  type WeightInputFormValue
} from "./WeightInputForm";

import { registerWeightRecord } from "@/features/weight/registration";

export function WeightRecordRegistrationForm() {
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

    return {
      isSuccess: true
    };
  }

  return <WeightInputForm onSubmit={handleSubmit} />;
}
