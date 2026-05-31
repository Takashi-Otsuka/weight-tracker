import { getCurrentIsoTimestamp } from "@/lib/date";
import { logger } from "@/lib/logger";

import { saveWeightRecord } from "./storage";

import type { WeightRecord } from "./types";

export type RegisterWeightRecordInput = {
  date: string;
  weightKg: number;
  memo?: string;
};

export type RegisterWeightRecordSuccess = {
  isSuccess: true;
  record: WeightRecord;
  records: WeightRecord[];
};

export type RegisterWeightRecordFailure = {
  isSuccess: false;
  message: string;
};

export type RegisterWeightRecordResult =
  | RegisterWeightRecordSuccess
  | RegisterWeightRecordFailure;

export type RegisterWeightRecordOptions = {
  createId?: () => string;
  getTimestamp?: () => string;
};

const STORAGE_ERROR_MESSAGE = "体重記録の保存に失敗しました";

export function registerWeightRecord(
  input: RegisterWeightRecordInput,
  options: RegisterWeightRecordOptions = {}
): RegisterWeightRecordResult {
  const getTimestamp = options.getTimestamp ?? getCurrentIsoTimestamp;
  const createId = options.createId ?? createWeightRecordId;
  const timestamp = getTimestamp();
  const record: WeightRecord = {
    id: createId(),
    date: input.date,
    weightKg: input.weightKg,
    memo: input.memo,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  try {
    const records = saveWeightRecord(record);

    logger.info("weight_record_registered", {
      action: "register_weight_record",
      result: "success"
    });

    return {
      isSuccess: true,
      record,
      records
    };
  } catch (error) {
    logger.error("failed_to_register_weight_record", error, {
      action: "register_weight_record",
      result: "failed"
    });

    return {
      isSuccess: false,
      message: STORAGE_ERROR_MESSAGE
    };
  }
}

function createWeightRecordId(): string {
  return globalThis.crypto.randomUUID();
}
