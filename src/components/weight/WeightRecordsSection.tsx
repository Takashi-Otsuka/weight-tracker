"use client";

import { useEffect, useState } from "react";

import { getWeightRecords } from "@/features/weight/storage";

import { WeightRecordList } from "./WeightRecordList";
import { WeightRecordRegistrationForm } from "./WeightRecordRegistrationForm";

import type { WeightRecord } from "@/features/weight/types";

export function WeightRecordsSection() {
  const [records, setRecords] = useState<WeightRecord[]>([]);

  function refreshRecords() {
    setRecords(getWeightRecords());
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(refreshRecords, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <WeightRecordRegistrationForm onSaveSuccess={refreshRecords} />
      <WeightRecordList records={records} />
    </>
  );
}
