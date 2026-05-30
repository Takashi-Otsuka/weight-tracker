# Error Handling Policy

## Purpose

本プロジェクトにおけるエラーハンドリング方針を定義する。

目的

* アプリをクラッシュさせない
* ユーザーへ適切なメッセージを表示する
* 障害調査を可能にする
* Sentryによる監視を前提とする

---

# Basic Principle

## UIを落とさない

ユーザー操作による例外でアプリをクラッシュさせない。

例外発生時は適切なエラー表示を行う。

---

## Fail Safe

異常時は可能な限り安全な値を返す。

例

```ts
[]
{}
null
DEFAULT_GOAL_SETTING
```

ただし、予期しない例外は握り潰さない。

以下を実施する。

* loggerへ記録
* Sentryへ送信
* ユーザーへ簡易メッセージ表示

---

# Error Classification

本プロジェクトではエラーを以下に分類する。

---

## Validation Error

ユーザー入力起因。

例

* 体重未入力
* 不正な日付
* 数値変換失敗
* 負数入力

対応

* フォームエラー表示

Sentry送信

```text
No
```

---

## Business Error

業務ルール違反。

例

* 目標体重が現在体重以上
* 減量ペースが異常
* 許容範囲外の入力

対応

* ユーザーへ説明表示

Sentry送信

```text
No
```

---

## System Error

システム起因。

例

* localStorage破損
* 想定外データ
* Runtime Error
* 実装ミス

対応

* logger出力
* Sentry送信
* ユーザーへ簡易メッセージ表示

Sentry送信

```text
Yes
```

---

# User Facing Message

技術的なエラーを表示しない。

NG

```text
SyntaxError: Unexpected token
```

OK

```text
データの読み込みに失敗しました
```

---

# Logging

詳細は `docs/LOGGING_POLICY.md` に従う。

原則として、UIやfeature層から直接consoleを呼ばない。

ログ出力は `lib/logger.ts` を経由する。

---

# localStorage

必ず例外処理を行う。

例

```ts
try {
  return JSON.parse(value);
} catch (error) {
  logger.warn("failed_to_parse_storage", {
    storageKey: "weight-app:weight-records",
  });

  return [];
}
```

---

## localStorage破損時

以下を行う。

* デフォルト値返却
* logger出力
* Sentry通知
* ユーザーへ簡易メッセージ表示

---

# Error Boundary

React Error Boundaryを導入する。

目的

* 画面全体のクラッシュ防止

表示

```text
問題が発生しました。
画面を再読み込みしてください。
```

---

# API Error

将来Supabase導入時は以下を区別する。

* Validation Error
* Authentication Error
* Authorization Error
* Network Error
* Server Error

---

# Sentry Policy

将来的に導入する。

---

## Capture Target

対象

* Runtime Error
* React Error Boundary
* API Error
* Storage Error
* E2E Failure
* Unexpected Error

---

## Do Not Send

送信禁止

* パスワード
* メールアドレス
* 個人情報
* メモ内容
* セッション情報
* 認証トークン
* localStorage全文

---

# Test Requirement

エラー処理を実装した場合、以下をテストする。

* Validation Error
* Business Error
* System Error
* localStorage破損
* null
* undefined
* 数値変換失敗
* 想定外データ

ロジック層は100%カバレッジ対象とする。
