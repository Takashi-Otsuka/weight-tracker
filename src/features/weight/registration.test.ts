import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

import { registerWeightRecord } from "./registration";

vi.mock("@/lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

beforeEach(() => {
  localStorage.clear();
  vi.mocked(logger.info).mockClear();
  vi.mocked(logger.error).mockClear();
});

describe("registerWeightRecord", () => {
  it("creates and saves a weight record", () => {
    const result = registerWeightRecord(
      {
        date: "2026-05-30",
        weightKg: 80.1,
        memo: "memo"
      },
      {
        createId: () => "record-1",
        getTimestamp: () => "2026-05-30T00:00:00.000Z"
      }
    );

    const expectedRecord = {
      id: "record-1",
      date: "2026-05-30",
      weightKg: 80.1,
      memo: "memo",
      createdAt: "2026-05-30T00:00:00.000Z",
      updatedAt: "2026-05-30T00:00:00.000Z"
    };

    expect(result).toEqual({
      isSuccess: true,
      record: expectedRecord,
      records: [expectedRecord]
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS)!)).toEqual([
      expectedRecord
    ]);
    expect(logger.info).toHaveBeenCalledWith("weight_record_registered", {
      action: "register_weight_record",
      result: "success"
    });
  });

  it("returns a storage error message and logs when saving fails", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    expect(
      registerWeightRecord(
        {
          date: "2026-05-30",
          weightKg: 80.1
        },
        {
          createId: () => "record-1",
          getTimestamp: () => "2026-05-30T00:00:00.000Z"
        }
      )
    ).toEqual({
      isSuccess: false,
      message: "体重記録の保存に失敗しました"
    });
    expect(logger.error).toHaveBeenCalledWith(
      "failed_to_register_weight_record",
      expect.any(Error),
      {
        action: "register_weight_record",
        result: "failed"
      }
    );

    setItem.mockRestore();
  });
});
