import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

import {
  deleteWeightRecord,
  getWeightRecords,
  saveWeightRecord
} from "./storage";

import type { WeightRecord } from "./types";

vi.mock("@/lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

const firstRecord: WeightRecord = {
  id: "record-1",
  date: "2026-05-30",
  weightKg: 80.1,
  memo: "memo",
  createdAt: "2026-05-30T00:00:00.000Z",
  updatedAt: "2026-05-30T00:00:00.000Z"
};

const secondRecord: WeightRecord = {
  id: "record-2",
  date: "2026-05-31",
  weightKg: 79.9,
  createdAt: "2026-05-31T00:00:00.000Z",
  updatedAt: "2026-05-31T00:00:00.000Z"
};

const updatedFirstRecord: WeightRecord = {
  id: "record-3",
  date: "2026-05-30",
  weightKg: 79.5,
  createdAt: "2026-05-30T01:00:00.000Z",
  updatedAt: "2026-05-30T01:00:00.000Z"
};

beforeEach(() => {
  localStorage.clear();
  vi.mocked(logger.warn).mockClear();
  vi.mocked(logger.error).mockClear();
});

describe("getWeightRecords", () => {
  it("returns an empty array when storage has no records", () => {
    expect(getWeightRecords()).toEqual([]);
  });

  it("returns records sorted by date descending by default", () => {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify([firstRecord, secondRecord])
    );

    expect(getWeightRecords()).toEqual([secondRecord, firstRecord]);
  });

  it("returns records sorted by date ascending", () => {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify([secondRecord, firstRecord])
    );

    expect(getWeightRecords("asc")).toEqual([firstRecord, secondRecord]);
  });

  it("returns already sorted records by date ascending", () => {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify([firstRecord, secondRecord])
    );

    expect(getWeightRecords("asc")).toEqual([firstRecord, secondRecord]);
  });

  it("keeps order for records with the same date", () => {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify([firstRecord, updatedFirstRecord])
    );

    expect(getWeightRecords()).toEqual([firstRecord, updatedFirstRecord]);
  });

  it("returns an empty array and logs when JSON is corrupted", () => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, "{");

    expect(getWeightRecords()).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith("failed_to_load_weight_records", {
      storageKey: STORAGE_KEYS.WEIGHT_RECORDS
    });
    expect(logger.error).toHaveBeenCalledWith(
      "weight_records_storage_error",
      expect.any(Object),
      {
        storageKey: STORAGE_KEYS.WEIGHT_RECORDS
      }
    );
  });

  it("returns an empty array and logs when stored value is not an array", () => {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify({ records: [firstRecord] })
    );

    expect(getWeightRecords()).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith("invalid_weight_records_storage", {
      storageKey: STORAGE_KEYS.WEIGHT_RECORDS
    });
  });

  it("returns an empty array and logs when stored record shape is invalid", () => {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify([{ ...firstRecord, date: "invalid" }])
    );

    expect(getWeightRecords()).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith("invalid_weight_records_storage", {
      storageKey: STORAGE_KEYS.WEIGHT_RECORDS
    });
  });

  it("returns an empty array and logs when stored record is not an object", () => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, JSON.stringify([null]));

    expect(getWeightRecords()).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith("invalid_weight_records_storage", {
      storageKey: STORAGE_KEYS.WEIGHT_RECORDS
    });
  });
});

describe("saveWeightRecord", () => {
  it("adds a weight record", () => {
    expect(saveWeightRecord(firstRecord)).toEqual([firstRecord]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS)!)).toEqual([
      firstRecord
    ]);
  });

  it("overwrites a record with the same date", () => {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify([firstRecord, secondRecord])
    );

    expect(saveWeightRecord(updatedFirstRecord)).toEqual([
      secondRecord,
      updatedFirstRecord
    ]);
  });

  it("logs and returns next records when saving fails", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    expect(saveWeightRecord(firstRecord)).toEqual([firstRecord]);
    expect(logger.error).toHaveBeenCalledWith(
      "failed_to_save_weight_records",
      expect.any(Error),
      {
        storageKey: STORAGE_KEYS.WEIGHT_RECORDS
      }
    );

    setItem.mockRestore();
  });
});

describe("deleteWeightRecord", () => {
  it("deletes a weight record by id", () => {
    localStorage.setItem(
      STORAGE_KEYS.WEIGHT_RECORDS,
      JSON.stringify([firstRecord, secondRecord])
    );

    expect(deleteWeightRecord("record-1")).toEqual([secondRecord]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS)!)).toEqual([
      secondRecord
    ]);
  });
});
