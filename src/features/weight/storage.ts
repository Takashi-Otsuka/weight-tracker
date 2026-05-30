import { STORAGE_KEYS } from "@/lib/constants";
import { isValidDateString } from "@/lib/date";
import { logger } from "@/lib/logger";

import type { WeightRecord } from "./types";

export type WeightRecordSortOrder = "asc" | "desc";

export function getWeightRecords(
  sortOrder: WeightRecordSortOrder = "desc"
): WeightRecord[] {
  const records = loadWeightRecords();

  return sortWeightRecords(records, sortOrder);
}

export function saveWeightRecord(record: WeightRecord): WeightRecord[] {
  const records = loadWeightRecords();
  const nextRecords = records.filter(
    (currentRecord) => currentRecord.date !== record.date
  );

  nextRecords.push(record);

  return saveWeightRecords(nextRecords);
}

export function deleteWeightRecord(id: string): WeightRecord[] {
  const records = loadWeightRecords();
  const nextRecords = records.filter((record) => record.id !== id);

  return saveWeightRecords(nextRecords);
}

function loadWeightRecords(): WeightRecord[] {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS);

    if (rawValue === null) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isWeightRecordArray(parsedValue)) {
      logger.warn("invalid_weight_records_storage", {
        storageKey: STORAGE_KEYS.WEIGHT_RECORDS
      });

      return [];
    }

    return parsedValue;
  } catch (error) {
    logger.warn("failed_to_load_weight_records", {
      storageKey: STORAGE_KEYS.WEIGHT_RECORDS
    });
    logger.error("weight_records_storage_error", error, {
      storageKey: STORAGE_KEYS.WEIGHT_RECORDS
    });

    return [];
  }
}

function saveWeightRecords(records: WeightRecord[]): WeightRecord[] {
  const sortedRecords = sortWeightRecords(records, "desc");

  try {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify(sortedRecords)
    );
  } catch (error) {
    logger.error("failed_to_save_weight_records", error, {
      storageKey: STORAGE_KEYS.WEIGHT_RECORDS
    });
  }

  return sortedRecords;
}

function sortWeightRecords(
  records: WeightRecord[],
  sortOrder: WeightRecordSortOrder
): WeightRecord[] {
  return [...records].sort((left, right) => {
    if (left.date === right.date) {
      return 0;
    }

    if (sortOrder === "asc") {
      return left.date < right.date ? -1 : 1;
    }

    return left.date > right.date ? -1 : 1;
  });
}

function isWeightRecordArray(value: unknown): value is WeightRecord[] {
  return Array.isArray(value) && value.every(isWeightRecord);
}

function isWeightRecord(value: unknown): value is WeightRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Partial<WeightRecord>;

  return (
    typeof record.id === "string" &&
    typeof record.date === "string" &&
    isValidDateString(record.date) &&
    typeof record.weightKg === "number" &&
    Number.isFinite(record.weightKg) &&
    (record.memo === undefined || typeof record.memo === "string") &&
    typeof record.createdAt === "string" &&
    typeof record.updatedAt === "string"
  );
}
