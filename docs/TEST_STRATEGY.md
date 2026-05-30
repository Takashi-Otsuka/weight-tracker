# Test Strategy

## Purpose

本ドキュメントは、体重管理アプリにおけるテスト方針を定義する。

目的は以下の通り。

* 計算ロジックの正確性を保証する
* 重要UIの操作品質を保証する
* 主要ユーザーフローを自動検証する
* Codexによる実装品質を安定させる

---

# Test Levels

## 1. Unit Test

### Tool

* Vitest

### Target

ロジック層を対象とする。

対象例:

```text
features/**
lib/**
```

具体例:

```text
features/weight/calculations.ts
features/weight/storage.ts
features/simulation/calculations.ts
features/goal/calculations.ts
lib/date.ts
lib/number.ts
```

### Coverage

ロジック層はカバレッジ100%を必須とする。

```text
Statements: 100%
Branches: 100%
Functions: 100%
Lines: 100%
```

### Required Test Cases

必ず以下を考慮する。

* 正常系
* 境界値
* null
* undefined
* 空文字
* 空配列
* 不正な日付
* 不正な体重
* 小数値
* localStorage破損
* 例外発生時

---

# 2. Component Test

## Tool

* React Testing Library
* Vitest

## Target

重要コンポーネントのみ対象とする。

対象例:

```text
WeightInputForm
GoalSettingForm
SimulationByDateForm
SimulationByPaceForm
WeightRecordList
SimulationResultCard
```

## Scope

UI全体のカバレッジ100%は要求しない。

ただし、以下はテストする。

* 初期表示
* 入力操作
* バリデーション
* ボタン押下
* コールバック呼び出し
* エラー表示
* 空データ表示

## Example Cases

### WeightInputForm

* 今日の日付が初期表示される
* 体重を入力できる
* 不正な体重では保存されない
* 正常入力時に保存イベントが発火する
* メモなしでも保存できる

### SimulationByDateForm

* 目標体重と目標日を入力できる
* 必要減量ペースを計算できる
* 速すぎるペースの場合に警告が表示される

---

# 3. E2E Test

## Tool

* Playwright

## Environment

* Staging

## Target

主要ユーザーフローを対象とする。

## Required Scenarios

### Weight Record Flow

* 体重を登録できる
* 登録後にホームへ反映される
* 記録一覧に表示される
* 記録を編集できる
* 記録を削除できる

### Goal Setting Flow

* 目標体重を設定できる
* 目標日を設定できる
* ホームに目標との差分が表示される
* グラフに目標ラインが表示される

### Simulation Flow

* 目標体重と目標日から必要ペースを算出できる
* 目標体重と日あたり減量量から達成予定日を算出できる
* 減量ペースが速すぎる場合に警告が表示される

### Navigation Flow

* Homeへ遷移できる
* Recordsへ遷移できる
* Chartへ遷移できる
* Simulationへ遷移できる
* Settingsへ遷移できる

---

# Test Command Policy

## Local

開発者がローカルで実行する。

```bash
npm run lint
npm run build
npm run test
npm run test:coverage
```

## Staging

ステージング環境で実行する。

```bash
npm run test:e2e
```

---

# Recommended package.json scripts

```json
{
  "scripts": {
    "lint": "next lint",
    "build": "next build",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

# Test File Naming

## Unit Test

```text
*.test.ts
```

例:

```text
calculations.test.ts
storage.test.ts
date.test.ts
```

## Component Test

```text
*.test.tsx
```

例:

```text
WeightInputForm.test.tsx
SimulationByDateForm.test.tsx
```

## E2E Test

```text
*.spec.ts
```

例:

```text
weight-record.spec.ts
simulation.spec.ts
```

---

# Test Directory Policy

原則としてテスト対象ファイルの近くに配置する。

例:

```text
features/
  simulation/
    calculations.ts
    calculations.test.ts

components/
  weight/
    WeightInputForm.tsx
    WeightInputForm.test.tsx
```

E2Eのみ専用ディレクトリに配置する。

```text
e2e/
  weight-record.spec.ts
  simulation.spec.ts
```

---

# Mock Policy

## localStorage

Unit Testではmockする。

## Date

日付依存テストでは固定日付を利用する。

例:

```text
2026-05-30
```

## External API

MVPでは外部APIを利用しない。

将来Supabase等を利用する場合はmock化する。

---

# CI Policy

GitHub Actionsで以下を実行する。

```bash
npm run lint
npm run build
npm run test:coverage
```

mainへのPull Requestでは上記成功を必須とする。

E2Eはstaging環境が整備された後に追加する。

```bash
npm run test:e2e
```

---

# Phase Policy

## Phase 1

必須:

* Unit Test
* Logic Coverage 100%

可能なら実施:

* 重要Component Test

未実施可:

* E2E

---

## Phase 2

必須:

* Unit Test
* Component Test
* Logic Coverage 100%

可能なら実施:

* E2E

---

## Phase 3以降

必須:

* Unit Test
* Component Test
* E2E
* CI Quality Gate

---

# Codex Rule

Codexに実装を依頼する場合、以下を守る。

* ロジック実装時はUnit Testも同時に作成する
* 重要UI実装時はComponent Testも同時に作成する
* テストなしで完了扱いにしない
* カバレッジ不足の場合は追加テストを作成する
* E2E対象機能はPlaywrightテストを追加する
