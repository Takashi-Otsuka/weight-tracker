# Codex Workflow

## Purpose

本ドキュメントは、本プロジェクトにおけるCodex利用手順を定義する。

目的

* Issueから実装までの流れを標準化する
* 人間とCodexの責務を明確にする
* PR品質を一定に保つ
* 実装のトレーサビリティを確保する

---

# Responsibility

## Human

人間が担当する。

* Issue起票
* 優先順位決定
* 要件整理
* 最終レビュー
* Merge判断
* リリース判断

---

## Codex

Codexが担当する。

* ドキュメント確認
* 実装計画作成
* コード実装
* テスト作成
* テスト実行
* Commit
* Push
* Draft Pull Request作成

---

# Standard Flow

```text
Issue
↓
Codex Planning
↓
Codex Implementation
↓
Test
↓
Commit
↓
Push
↓
Draft PR
↓
Human Review
↓
Ready for Review
↓
CI Success
↓
Merge
↓
Issue Close
```

---

# Issue Rules

作業開始前にIssueが存在していること。

Issueには以下を含める。

* Purpose
* Acceptance Criteria
* Out of Scope
* Milestone
* Label

---

# Branch Rules

Issueごとにブランチを作成する。

形式

```text
feature/{issue-number}-{summary}
fix/{issue-number}-{summary}
docs/{issue-number}-{summary}
chore/{issue-number}-{summary}
test/{issue-number}-{summary}
```

例

```text
feature/12-domain-models
feature/15-storage-layer
fix/22-date-calculation
docs/30-update-spec
docs/8-align-codex-workflow
```

---

# Planning Phase

実装前に必ず計画を提示する。

提示内容

```text
1. 実装方針
2. 作成・変更ファイル
3. テスト方針
4. 影響範囲
5. リスク
6. ドキュメント更新要否
```

計画承認前に実装しない。

---

# Implementation Rules

実装時は以下を遵守する。

* .codex/instructions.md
* docs/SPEC.md
* docs/ARCHITECTURE.md
* docs/DEVELOPMENT_RULES.md
* docs/AUTOMATION_POLICY.md

Scope外の変更は禁止。

---

# Test Rules

実装完了後は以下を実行する。

```bash
npm run lint
npm run build
npm run test
npm run test:coverage
```

失敗した状態でPRを作成しない。

---

# Commit Rules

Conventional Commitsを利用する。

例

```text
feat: define domain models
feat: implement storage layer
fix: handle invalid localStorage data
docs: update specification
test: add simulation tests
chore: setup playwright
```

---

# Pull Request Rules

Draft Pull Requestを作成する。

Ready for Reviewには変更しない。

人間がレビュー後に変更する。

---

## PR Title

Conventional Commits形式。

例

```text
feat: define domain models
```

---

## PR Body

必須項目

```md
## Related Issue

Closes #<issue number>

## Summary

変更概要

## Changes

変更一覧

## Test

- npm run lint
- npm run build
- npm run test
- npm run test:coverage
```

---

# Review Rules

人間は以下を確認する。

* Scope外変更がない
* Acceptance Criteriaを満たす
* テスト結果が妥当
* DODを満たす
* ドキュメント更新漏れがない

---

# Merge Rules

以下を満たした場合のみMergeする。

* CI Success
* Human Review完了
* DOD達成
* PR内容確認済み

Merge方式はSquash Mergeとする。

---

# Issue Close Rules

PR本文に以下を記載する。

```text
Closes #<issue number>
```

IssueはPRマージ時に自動Closeされる。

手動Closeは原則行わない。

---

# Emergency Fix

緊急修正時もIssueを作成する。

例外的なmain直接修正は禁止。

必ずPR経由で変更する。

---

# Success Criteria

理想的な運用

```text
Issue
↓
Codex
↓
Draft PR
↓
Human Review
↓
Merge
↓
Issue Auto Close
```

人間は設計判断とレビューに集中し、
実装・テスト・PR作成はCodexへ委譲する。
