# Naming Convention

## Purpose

本ドキュメントは命名規則を定義する。

可読性・保守性・AI開発支援（Codex）との整合性を目的とする。

---

# TypeScript Policy

## type

本プロジェクトでは `type` を利用する。

例

```ts
type WeightRecord = {
  id: string;
  date: string;
  weightKg: number;
};
```

---

## interface

原則使用しない。

NG

```ts
interface WeightRecord {
  id: string;
}
```

---

## enum

原則使用しない。

代わりにUnion Typeを利用する。

OK

```ts
type PaceLevel =
  | "slow"
  | "recommended"
  | "fast"
  | "too_fast";
```

NG

```ts
enum PaceLevel {
  Slow,
  Recommended,
  Fast,
  TooFast,
}
```

---

# File Naming

## React Component

PascalCase

例

```text
WeightInputForm.tsx
WeightRecordList.tsx
GoalSettingForm.tsx
SimulationResultCard.tsx
```

---

## Hook

use + PascalCase

例

```text
useWeightRecords.ts
useGoalSetting.ts
useSimulation.ts
```

---

## Utility

lowercase

例

```text
date.ts
number.ts
storage.ts
validation.ts
```

---

## Test

対象ファイル名 + .test

例

```text
WeightInputForm.test.tsx
calculations.test.ts
storage.test.ts
```

---

# Variable Naming

## General Variable

camelCase

```ts
const currentWeight = 80;
const targetWeight = 75;
```

---

## Boolean

接頭辞を付与する。

```ts
isLoading
isGoalReached
hasRecords
canSubmit
shouldDisplayWarning
```

許可プレフィックス

```text
is
has
can
should
```

---

# Function Naming

camelCase

例

```ts
calculateRequiredPace()
calculateWeightTrend()
saveWeightRecord()
loadGoalSetting()
```

---

# Component Naming

PascalCase

```ts
WeightInputForm
WeightRecordList
GoalSettingForm
```

---

# Type Naming

PascalCase

```ts
WeightRecord
GoalSetting
SimulationResult
PaceLevel
```

---

# Constant Naming

UPPER_SNAKE_CASE

例

```ts
MAX_WEIGHT
DEFAULT_TARGET_DAYS
MAX_MEMO_LENGTH
```

---

# Storage Key Naming

例

```ts
const STORAGE_KEYS = {
  WEIGHT_RECORDS: "weight-app:weight-records",
  GOAL_SETTING: "weight-app:goal-setting",
};
```

---

# Event Handler Naming

handle + Action

例

```ts
handleSubmit()
handleDelete()
handleSave()
handleGoalUpdate()
```

---

# Test Naming

Given / When / Then を意識する。

例

```ts
it("returns required pace when target date is specified")

it("returns default value when localStorage data is invalid")

it("shows validation error when weight is empty")
```
