# ADR 002: Use localStorage for MVP

## Status

Accepted

## Context

MVPでは以下の要件がある。

* 自分用として素早く利用開始したい
* 体重記録を端末内に保存できればよい
* 認証機能は初期段階では不要
* サーバー・DB構築の負荷を避けたい
* 将来的にはSupabaseへ移行したい

保存対象は主に以下。

* 体重記録
* 目標設定
* UI設定

候補として以下を検討した。

* localStorage
* IndexedDB
* SQLite
* Supabase
* Firebase

---

## Decision

MVPではlocalStorageを採用する。

ただし、将来的なSupabase移行を前提に、UI層から直接localStorageを呼ばない。

保存処理は必ずstorage層に分離する。

例

```text
features/weight/storage.ts
features/goal/storage.ts
```

---

## Reasons

### 1. 開発速度

localStorageは追加のサーバーやDBなしで利用できる。

MVPを素早く作成できる。

---

### 2. 自分用アプリとして十分

初期段階では自分のiPhone / ブラウザで記録できればよい。

クラウド同期は必須ではない。

---

### 3. 実装が単純

API、認証、DBマイグレーションを用意せずに開始できる。

---

### 4. 将来移行しやすい

以下のルールにより、Supabase移行時の影響範囲を抑える。

* componentからlocalStorageを直接呼ばない
* page.tsxからlocalStorageを直接呼ばない
* storage層を経由する
* データ型を明示する
* 保存形式を安定させる

---

## Consequences

### Positive

* 初期開発が速い
* インフラ不要
* オフラインでも利用可能
* MVP検証に向いている

---

### Negative

* 複数端末同期できない
* ブラウザ変更時にデータ移行できない
* データ消失リスクがある
* 容量制限がある
* バックアップがない

---

## Risk Mitigation

以下でリスクを軽減する。

* localStorage破損時はデフォルト値を返す
* storage層で例外処理を行う
* データ形式を型定義する
* 将来CSVエクスポートを追加する
* 将来Supabaseへ移行する

---

## Alternatives Considered

### IndexedDB

選定しなかった理由

* localStorageより実装が重い
* MVPでは保存データ量が少ない
* 体重記録では高度なクエリは不要

---

### Supabase

選定しなかった理由

* 認証、DB、環境変数、RLS設計が必要
* MVP初期では構築コストが高い

将来的には採用予定。

---

### Firebase

選定しなかった理由

* リアルタイム同期はMVPでは不要
* 将来的なSQL分析にはSupabase/PostgreSQLの方が適している

---

## Follow-up

将来的に以下を検討する。

* Supabase移行
* CSVエクスポート
* データバックアップ
* 複数端末同期
* 認証機能
