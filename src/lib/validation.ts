import { MAX_WEIGHT_KG, MIN_WEIGHT_KG, WEIGHT_DECIMAL_PLACES } from "./constants";
import { isValidDateString } from "./date";

export type ValidationErrorCategory = "validation" | "business" | "system";

export type ValidationErrorCode =
  | "required"
  | "invalid_type"
  | "invalid_number"
  | "out_of_range"
  | "too_many_decimal_places"
  | "invalid_date"
  | "target_weight_must_be_less_than_current_weight"
  | "daily_loss_must_be_positive";

export type ValidationField =
  | "weightKg"
  | "date"
  | "currentWeightKg"
  | "targetWeightKg"
  | "targetDate"
  | "dailyLossKg";

export type ValidationError = {
  category: ValidationErrorCategory;
  code: ValidationErrorCode;
  field: ValidationField;
  message: string;
};

export type ValidationResult<T> =
  | {
      isValid: true;
      value: T;
    }
  | {
      isValid: false;
      errors: ValidationError[];
    };

export type GoalWeightInput = {
  currentWeightKg: unknown;
  targetWeightKg: unknown;
};

export type SimulationByDateInput = GoalWeightInput & {
  targetDate: unknown;
};

export type SimulationByPaceInput = GoalWeightInput & {
  dailyLossKg: unknown;
};

export type GoalWeightValue = {
  currentWeightKg: number;
  targetWeightKg: number;
};

export type SimulationByDateValue = GoalWeightValue & {
  targetDate: string;
};

export type SimulationByPaceValue = GoalWeightValue & {
  dailyLossKg: number;
};

export function validateWeight(value: unknown): ValidationResult<number> {
  return validateWeightField(value, "weightKg");
}

export function validateDate(value: unknown): ValidationResult<string> {
  if (isRequiredMissing(value)) {
    return failure([
      createError("validation", "required", "date", "日付を入力してください")
    ]);
  }

  if (typeof value !== "string") {
    return failure([
      createError("system", "invalid_type", "date", "日付の形式が不正です")
    ]);
  }

  if (!isValidDateString(value)) {
    return failure([
      createError("validation", "invalid_date", "date", "日付が不正です")
    ]);
  }

  return success(value);
}

export function validateTargetWeight(
  input: GoalWeightInput
): ValidationResult<GoalWeightValue> {
  const currentWeightResult = validateWeightField(
    input.currentWeightKg,
    "currentWeightKg"
  );
  const targetWeightResult = validateWeightField(
    input.targetWeightKg,
    "targetWeightKg"
  );

  if (!currentWeightResult.isValid || !targetWeightResult.isValid) {
    return failure(collectErrors(currentWeightResult, targetWeightResult));
  }

  const currentWeightKg = currentWeightResult.value;
  const targetWeightKg = targetWeightResult.value;

  if (targetWeightKg >= currentWeightKg) {
    return failure([
      createError(
        "business",
        "target_weight_must_be_less_than_current_weight",
        "targetWeightKg",
        "目標体重は現在体重より小さい値を入力してください"
      )
    ]);
  }

  return success({ currentWeightKg, targetWeightKg });
}

export function validateSimulationByDateInput(
  input: SimulationByDateInput
): ValidationResult<SimulationByDateValue> {
  const goalWeightResult = validateTargetWeight(input);
  const targetDateResult = validateDateField(input.targetDate, "targetDate");

  if (!goalWeightResult.isValid || !targetDateResult.isValid) {
    return failure(collectErrors(goalWeightResult, targetDateResult));
  }

  return success({
    ...goalWeightResult.value,
    targetDate: targetDateResult.value
  });
}

export function validateSimulationByPaceInput(
  input: SimulationByPaceInput
): ValidationResult<SimulationByPaceValue> {
  const goalWeightResult = validateTargetWeight(input);
  const dailyLossResult = validateDailyLoss(input.dailyLossKg);

  if (!goalWeightResult.isValid || !dailyLossResult.isValid) {
    return failure(collectErrors(goalWeightResult, dailyLossResult));
  }

  return success({
    ...goalWeightResult.value,
    dailyLossKg: dailyLossResult.value
  });
}

function validateWeightField(
  value: unknown,
  field: "weightKg" | "currentWeightKg" | "targetWeightKg"
): ValidationResult<number> {
  const normalizedValue = normalizeNumber(value, field);

  if (!normalizedValue.isValid) {
    return normalizedValue;
  }

  const weightKg = normalizedValue.value;

  if (weightKg <= MIN_WEIGHT_KG || weightKg > MAX_WEIGHT_KG) {
    return failure([
      createError(
        "validation",
        "out_of_range",
        field,
        `体重は${MIN_WEIGHT_KG}kgより大きく${MAX_WEIGHT_KG}kg以下で入力してください`
      )
    ]);
  }

  if (getDecimalPlaces(value) > WEIGHT_DECIMAL_PLACES) {
    return failure([
      createError(
        "validation",
        "too_many_decimal_places",
        field,
        `体重は小数${WEIGHT_DECIMAL_PLACES}桁までで入力してください`
      )
    ]);
  }

  return success(weightKg);
}

function validateDateField(
  value: unknown,
  field: "targetDate"
): ValidationResult<string> {
  const dateResult = validateDate(value);

  if (!dateResult.isValid) {
    return failure(
      dateResult.errors.map((error) => ({
        ...error,
        field
      }))
    );
  }

  return dateResult;
}

function validateDailyLoss(value: unknown): ValidationResult<number> {
  const normalizedValue = normalizeNumber(value, "dailyLossKg");

  if (!normalizedValue.isValid) {
    return normalizedValue;
  }

  if (normalizedValue.value <= 0) {
    return failure([
      createError(
        "validation",
        "daily_loss_must_be_positive",
        "dailyLossKg",
        "日あたり減量量は0より大きい値を入力してください"
      )
    ]);
  }

  return success(normalizedValue.value);
}

function normalizeNumber(
  value: unknown,
  field: "weightKg" | "currentWeightKg" | "targetWeightKg" | "dailyLossKg"
): ValidationResult<number> {
  if (isRequiredMissing(value)) {
    return failure([
      createError("validation", "required", field, "数値を入力してください")
    ]);
  }

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? success(value)
      : failure([
          createError(
            "validation",
            "invalid_number",
            field,
            "数値を入力してください"
          )
        ]);
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
      return failure([
        createError("validation", "required", field, "数値を入力してください")
      ]);
    }

    const numberValue = Number(trimmedValue);

    return Number.isFinite(numberValue)
      ? success(numberValue)
      : failure([
          createError(
            "validation",
            "invalid_number",
            field,
            "数値を入力してください"
          )
        ]);
  }

  return failure([
    createError("system", "invalid_type", field, "数値の形式が不正です")
  ]);
}

function isRequiredMissing(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

function getDecimalPlaces(value: unknown): number {
  const text = String(value).trim();
  const decimalPart = text.split(".")[1];

  return decimalPart === undefined ? 0 : decimalPart.length;
}

function collectErrors(
  ...results: ValidationResult<unknown>[]
): ValidationError[] {
  return results.flatMap((result) => (result.isValid ? [] : result.errors));
}

function success<T>(value: T): ValidationResult<T> {
  return {
    isValid: true,
    value
  };
}

function failure<T>(errors: ValidationError[]): ValidationResult<T> {
  return {
    isValid: false,
    errors
  };
}

function createError(
  category: ValidationErrorCategory,
  code: ValidationErrorCode,
  field: ValidationField,
  message: string
): ValidationError {
  return {
    category,
    code,
    field,
    message
  };
}
