# Automation Policy

## Purpose

本ドキュメントは、本プロジェクトにおける自動化方針を定義する。

目的

* Codexによる開発を標準化する
* 人間とCodexの責務を明確化する
* レビュー品質を維持する
* 自動化による事故を防止する

---

# Basic Principle

本プロジェクトは以下を基本方針とする。

```text
Human
↓
Issue

Codex
↓
Implementation
↓
Test
↓
Commit
↓
Push
↓
Draft Pull Request

Human
↓
Review
↓
Ready for Review
↓
Merge
```

---

# Responsibility

## Human Responsibilities

人間が担当する。

* 要件定義
* Issue作成
* 優先順位決定
* アーキテクチャ判断
* レビュー
* Merge判断
* リリース判断

---

## Codex Responsibilities

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

# Allowed Automation

Codexに委譲してよい作業。

## Development

* 型定義
* ロジック実装
* UI実装
* Storage実装
* テスト実装
* リファクタリング
* ドキュメント更新

---

## Verification

以下を実行してよい。

```bash
npm run lint
npm run build
npm run test
npm run test:coverage
```

将来的に追加。

```bash
npm run test:e2e
```

---

## Git

以下を実行してよい。

```bash
git switch -c
git add
git commit
git push
```

---

## GitHub

以下を実行してよい。

* Draft Pull Request作成
* PR本文作成
* Issue参照

---

# Prohibited Automation

Codexに委譲してはいけない作業。

## Review

禁止

* レビュー承認
* Ready for Review変更
* Self Approval

---

## Merge

禁止

* Merge
* Squash Merge
* Rebase Merge

---

## Release

禁止

* 本番リリース
* 本番環境変更
* Environment設定変更

---

## Repository Administration

禁止

* Branch Protection変更
* GitHub Settings変更
* Secrets変更
* Actions権限変更
* Ruleset変更

---

# Required Validation

CodexはCommit前に以下を成功させること。

```bash
npm run lint
npm run build
npm run test
npm run test:coverage
```

失敗した状態でCommitしないこと。

ドキュメントのみの変更でも、IssueのAcceptance Criteriaに含まれる場合は同じ検証を行う。

---

# Pull Request Policy

CodexはDraft Pull Requestを作成する。

---

## Required Sections

PRには以下を含める。

* Related Issue
* Summary
* Changes
* Test
* Risks / Notes

---

## Related Issue

以下を利用する。

```text
Closes #<issue number>
```

---

## Review Gate

Draft Pull Request作成後は人間へ引き渡す。

人間は以下を確認する。

* Scope外変更がない
* Acceptance Criteria達成
* DOD達成
* ドキュメント整合性
* テスト結果

---

# Documentation Consistency

以下の変更時は整合性確認を行う。

* 型定義変更
* アーキテクチャ変更
* データ構造変更
* 仕様変更

確認対象

* .codex/instructions.md
* SPEC.md
* ARCHITECTURE.md
* CODEX_WORKFLOW.md
* AUTOMATION_POLICY.md
* ADR
* 実装コード

---

# Success Criteria

理想状態

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

人間は設計とレビューに集中し、
実装・テスト・PR作成はCodexへ委譲する。
