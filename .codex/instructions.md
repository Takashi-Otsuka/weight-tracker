# Codex Instructions

## Purpose

本ファイルは、Codexが本プロジェクトで作業する際に必ず守るルールを定義する。

Codexはコード変更前に本ファイルおよび関連ドキュメントを読み、仕様・設計・品質基準に従って作業すること。

---

# Required Documents

作業前に必ず以下を読むこと。

```text
docs/SPEC.md
docs/ARCHITECTURE.md
docs/ROADMAP.md
docs/DEVELOPMENT_RULES.md
docs/DOD.md
docs/TEST_STRATEGY.md
docs/ISSUE_RULES.md
docs/DEPENDENCY_POLICY.md
docs/NAMING_CONVENTION.md
docs/ERROR_HANDLING.md
docs/LOGGING_POLICY.md
docs/DATE_POLICY.md
docs/CI_CD_POLICY.md
docs/STAGING_STRATEGY.md
```

---

# Working Principle

## Scope Control

指定されたIssue、Task、Phaseの範囲だけを実装すること。

勝手に以下を行わないこと。

* 仕様外の機能追加
* Phase外の機能実装
* 大規模リファクタリング
* 依存ライブラリ追加
* UIデザインの大幅変更

不明点がある場合は、勝手に決めずTODOコメントを残すこと。

---

## Implementation Planning

コード変更前に以下を提示すること。

```text
1. 実装方針
2. 作成・変更するファイル一覧
3. テスト方針
4. 影響範囲
5. リスク・懸念点
```

---

# Architecture Rules

以下を守ること。

* Next.js App Routerを利用する
* TypeScriptを利用する
* Tailwind CSSを利用する
* UIとビジネスロジックを分離する
* page.tsxにビジネスロジックを書かない
* componentからlocalStorageへ直接アクセスしない
* storage層を経由する
* 再利用可能なロジックはfeatures配下へ配置する
* 共通処理はlib配下へ配置する

---

# Coding Rules

## TypeScript

以下を守ること。

* any禁止
* interfaceは原則使用しない
* typeを利用する
* enumは原則使用しない
* Union Typeを利用する
* 未使用import禁止
* 未使用変数禁止

---

## Naming

`docs/NAMING_CONVENTION.md` に従うこと。

特に以下を守る。

* React Component: PascalCase
* Hook: use + PascalCase
* Function: camelCase
* Type: PascalCase
* Constant: UPPER_SNAKE_CASE
* Boolean: is / has / can / should を利用

---

## Date

`docs/DATE_POLICY.md` に従うこと。

* 保存形式は `YYYY-MM-DD`
* タイムゾーンは `Asia/Tokyo`
* アプリ内で直接 `new Date()` を乱用しない
* 日付処理は共通utilityを利用する

---

# Error Handling

`docs/ERROR_HANDLING.md` に従うこと。

以下を守る。

* UIをクラッシュさせない
* ユーザーに技術的エラーを表示しない
* Validation ErrorとSystem Errorを区別する
* localStorage破損を考慮する
* Error Boundary導入を前提にする

---

# Logging

`docs/LOGGING_POLICY.md` に従うこと。

以下を守る。

* UI層およびfeature層から直接consoleを呼ばない
* ログは `lib/logger.ts` を経由する
* 体重値をログに出さない
* メモ内容をログに出さない
* 個人情報をログに出さない
* ログメッセージはsnake_caseにする

---

# Testing Rules

`docs/TEST_STRATEGY.md` に従うこと。

## Unit Test

ロジック層はVitestで単体テストを作成する。

対象例

```text
features/**
lib/**
```

ロジック層はカバレッジ100%を維持すること。

---

## Component Test

重要UIコンポーネントはReact Testing Libraryでテストする。

対象例

```text
WeightInputForm
GoalSettingForm
SimulationByDateForm
SimulationByPaceForm
WeightRecordList
SimulationResultCard
```

---

## E2E Test

Playwrightを利用する。

ただしPhase1ではstaging整備後に導入する。

---

# Quality Gate

作業完了前に以下が通ること。

```bash
npm run lint
npm run build
npm run test
npm run test:coverage
```

E2E導入後は以下も通すこと。

```bash
npm run test:e2e
```

---

# Dependency Rules

`docs/DEPENDENCY_POLICY.md` に従うこと。

新規依存ライブラリは原則追加しない。

追加が必要な場合は以下を提示する。

```text
1. 追加理由
2. 代替案
3. bundle sizeや保守性への影響
4. ライセンス上の懸念
```

---

# Git Rules

`docs/DEVELOPMENT_RULES.md` に従うこと。

## Branch

以下を利用する。

```text
feature/*
fix/*
docs/*
chore/*
refactor/*
test/*
```

## Commit

Conventional Commitsを利用する。

例

```text
feat: add weight input form
fix: handle invalid localStorage data
docs: update development rules
test: add simulation calculation tests
```

---

# Pull Request Rules

Pull Requestでは以下を満たすこと。

* 1 PR = 1目的
* DODを満たす
* スクリーンショットを添付する
* テスト結果を記載する
* 不要な変更を含めない
* レビュー可能なサイズにする

---

# Documentation Update Rules

以下の場合は関連ドキュメントを更新すること。

* 仕様変更
* 画面追加
* データ構造変更
* アーキテクチャ変更
* 依存ライブラリ追加
* テスト方針変更
* エラーハンドリング変更
* ログ出力方針変更

---

# Prohibited Actions

以下は禁止。

* `any` の使用
* `enum` の使用
* `interface` の原則使用
* component内のlocalStorage直接操作
* page.tsxへのビジネスロジック記述
* production向けの直接console出力
* 体重値やメモ内容のログ出力
* 仕様外機能の実装
* 未確認の依存ライブラリ追加
* DOD未達での完了扱い

---

# Completion Report

作業完了時は以下を報告すること。

```text
1. 実装内容
2. 変更ファイル
3. テスト結果
4. DOD確認結果
5. 残課題
```
