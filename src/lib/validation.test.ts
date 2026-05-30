import { describe, expect, it } from "vitest";

import {
  validateDate,
  validateSimulationByDateInput,
  validateSimulationByPaceInput,
  validateTargetWeight,
  validateWeight
} from "./validation";

describe("validateWeight", () => {
  it("returns a valid result for a number", () => {
    expect(validateWeight(80.1)).toEqual({
      isValid: true,
      value: 80.1
    });
  });

  it("returns a valid result for a numeric string", () => {
    expect(validateWeight("80.1")).toEqual({
      isValid: true,
      value: 80.1
    });
  });

  it("returns a required validation error for null", () => {
    expect(validateWeight(null)).toEqual({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "required",
          field: "weightKg",
          message: "数値を入力してください"
        }
      ]
    });
  });

  it("returns a required validation error for undefined", () => {
    expect(validateWeight(undefined)).toEqual({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "required",
          field: "weightKg",
          message: "数値を入力してください"
        }
      ]
    });
  });

  it("returns a required validation error for an empty string", () => {
    expect(validateWeight("")).toEqual({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "required",
          field: "weightKg",
          message: "数値を入力してください"
        }
      ]
    });
  });

  it("returns a required validation error for a blank string", () => {
    expect(validateWeight("   ")).toEqual({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "required",
          field: "weightKg",
          message: "数値を入力してください"
        }
      ]
    });
  });

  it("returns an invalid number validation error for NaN", () => {
    expect(validateWeight(Number.NaN)).toEqual({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "invalid_number",
          field: "weightKg",
          message: "数値を入力してください"
        }
      ]
    });
  });

  it("returns an invalid number validation error for non numeric text", () => {
    expect(validateWeight("abc")).toEqual({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "invalid_number",
          field: "weightKg",
          message: "数値を入力してください"
        }
      ]
    });
  });

  it("returns a system error for an unexpected type", () => {
    expect(validateWeight({ value: 80 })).toEqual({
      isValid: false,
      errors: [
        {
          category: "system",
          code: "invalid_type",
          field: "weightKg",
          message: "数値の形式が不正です"
        }
      ]
    });
  });

  it("returns an out of range validation error for zero", () => {
    expect(validateWeight(0)).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "out_of_range",
          field: "weightKg"
        }
      ]
    });
  });

  it("returns an out of range validation error for values over 300kg", () => {
    expect(validateWeight(300.1)).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "out_of_range",
          field: "weightKg"
        }
      ]
    });
  });

  it("returns a decimal places validation error", () => {
    expect(validateWeight("80.12")).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "too_many_decimal_places",
          field: "weightKg"
        }
      ]
    });
  });
});

describe("validateDate", () => {
  it("returns a valid result for a valid date", () => {
    expect(validateDate("2026-05-30")).toEqual({
      isValid: true,
      value: "2026-05-30"
    });
  });

  it("returns a required validation error", () => {
    expect(validateDate("")).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "required",
          field: "date"
        }
      ]
    });
  });

  it("returns a system error for an unexpected type", () => {
    expect(validateDate(20260530)).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "system",
          code: "invalid_type",
          field: "date"
        }
      ]
    });
  });

  it("returns an invalid date validation error", () => {
    expect(validateDate("2026-02-29")).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "invalid_date",
          field: "date"
        }
      ]
    });
  });
});

describe("validateTargetWeight", () => {
  it("returns a valid result when target weight is less than current weight", () => {
    expect(
      validateTargetWeight({
        currentWeightKg: 80,
        targetWeightKg: 75
      })
    ).toEqual({
      isValid: true,
      value: {
        currentWeightKg: 80,
        targetWeightKg: 75
      }
    });
  });

  it("returns field-specific validation errors", () => {
    expect(
      validateTargetWeight({
        currentWeightKg: "",
        targetWeightKg: "abc"
      })
    ).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "required",
          field: "currentWeightKg"
        },
        {
          category: "validation",
          code: "invalid_number",
          field: "targetWeightKg"
        }
      ]
    });
  });

  it("returns a business error when target weight is not less than current weight", () => {
    expect(
      validateTargetWeight({
        currentWeightKg: 75,
        targetWeightKg: 75
      })
    ).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "business",
          code: "target_weight_must_be_less_than_current_weight",
          field: "targetWeightKg"
        }
      ]
    });
  });
});

describe("validateSimulationByDateInput", () => {
  it("returns a valid result for valid date mode input", () => {
    expect(
      validateSimulationByDateInput({
        currentWeightKg: 80,
        targetWeightKg: 75,
        targetDate: "2026-06-30"
      })
    ).toEqual({
      isValid: true,
      value: {
        currentWeightKg: 80,
        targetWeightKg: 75,
        targetDate: "2026-06-30"
      }
    });
  });

  it("returns a targetDate validation error", () => {
    expect(
      validateSimulationByDateInput({
        currentWeightKg: 80,
        targetWeightKg: 75,
        targetDate: "2026/06/30"
      })
    ).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "invalid_date",
          field: "targetDate"
        }
      ]
    });
  });
});

describe("validateSimulationByPaceInput", () => {
  it("returns a valid result for valid pace mode input", () => {
    expect(
      validateSimulationByPaceInput({
        currentWeightKg: 80,
        targetWeightKg: 75,
        dailyLossKg: "0.1"
      })
    ).toEqual({
      isValid: true,
      value: {
        currentWeightKg: 80,
        targetWeightKg: 75,
        dailyLossKg: 0.1
      }
    });
  });

  it("returns a daily loss validation error", () => {
    expect(
      validateSimulationByPaceInput({
        currentWeightKg: 80,
        targetWeightKg: 75,
        dailyLossKg: 0
      })
    ).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "daily_loss_must_be_positive",
          field: "dailyLossKg"
        }
      ]
    });
  });

  it("returns a daily loss invalid number error", () => {
    expect(
      validateSimulationByPaceInput({
        currentWeightKg: 80,
        targetWeightKg: 75,
        dailyLossKg: "abc"
      })
    ).toMatchObject({
      isValid: false,
      errors: [
        {
          category: "validation",
          code: "invalid_number",
          field: "dailyLossKg"
        }
      ]
    });
  });
});
