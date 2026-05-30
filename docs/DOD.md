# Definition of Done

## Purpose

本ドキュメントは本プロジェクトにおける「完了」の定義を定める。

TaskおよびBugは、本ドキュメントの条件を満たした場合のみ完了とする。

詳細なテスト方針は `docs/TEST_STRATEGY.md` に従う。

---

# Common

すべての変更に適用する。

## Build

以下が成功すること。

```bash
npm run lint
npm run build
npm run test
```

---

## TypeScript

以下を満たすこと。

* TypeScriptエラーなし
* any使用禁止
* 未使用importなし
* 未使用変数なし

---

## Code Quality

以下を満たすこと。

* 不要なconsole.logなし
* 不要なコメントなし
* TODOには理由を記載する
* 重複コードを作らない
* NAMING_CONVENTION.mdに従う

---

## Documentation

以下に該当する場合はドキュメントを更新する。

* 仕様変更
* 画面追加
* データ構造変更
* API変更
* アーキテクチャ変更
* 依存ライブラリ追加

更新対象例

```text
SPEC.md
ARCHITECTURE.md
ROADMAP.md
DEPENDENCY_POLICY.md
TEST_STRATEGY.md
```

---

# UI

UI変更を含む場合に適用する。

## Responsive

以下で表示崩れがないこと。

* iPhone
* Tablet
* Desktop

---

## UX

以下を満たすこと。

* エラー表示がある
* 空データ時の表示がある
* ボタン連打による問題がない
* スマホ操作を考慮している
* 主要操作が片手で実行可能

---

## Screenshot

Pull Requestへ添付すること。

### 既存画面変更

* 変更前
* 変更後

### 新規画面

* 変更後

---

## Component Test

重要コンポーネントは自動テストを実装する。

対象例

```text
WeightInputForm
GoalSettingForm
SimulationByDateForm
SimulationByPaceForm
WeightRecordList
SimulationResultCard
```

ツール

```text
React Testing Library
```

要件

* 主要操作をテストする
* 正常系をテストする
* バリデーションをテストする

UI全体のカバレッジ100%は要求しない。

---

# Logic

ロジック変更を含む場合に適用する。

## Architecture

以下を守ること。

* page.tsxにビジネスロジックを書かない
* localStorageへ直接アクセスしない
* storage層を経由する
* UIとロジックを分離する
* 再利用可能なロジックはfeatures配下へ配置する

---

## Unit Test

対象

```text
calculations.ts
storage.ts
hooks.ts
utils
services
```

ツール

```text
Vitest
```

---

## Coverage

ロジック層はカバレッジ100%を必須とする。

対象

```text
features/**
lib/**
```

達成基準

```text
Statements: 100%
Branches: 100%
Functions: 100%
Lines: 100%
```

---

## Edge Cases

以下を考慮すること。

* null
* undefined
* 空文字
* 空配列
* 不正な日付
* 不正な体重
* localStorage破損
* 数値変換失敗

---

# Test

## Local

ローカル環境で以下が成功すること。

```bash
npm run lint
npm run build
npm run test
npm run test:coverage
```

---

## Coverage Gate

ロジック層のカバレッジ100%を維持すること。

---

## Component Test

重要コンポーネントに対するテストが成功すること。

---

## E2E

E2E対象機能を追加・変更した場合は、対応するPlaywrightテストを更新すること。

---

# Pull Request

マージ前に以下を満たすこと。

## Required Checks

* lint成功
* build成功
* unit test成功
* component test成功

---

## Review Material

以下を添付する。

* スクリーンショット
* テスト結果

---

## Scope

以下を守ること。

* 1 PR = 1目的
* 不要な変更を含めない
* レビュー可能なサイズにする

---

# Future Quality Gate

GitHub Actionsで以下を自動実行する。

```bash
npm run lint
npm run build
npm run test:coverage
npm run test:e2e
```

すべて成功した場合のみmainへのマージを許可する。
