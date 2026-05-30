# Logging Policy

## Purpose

本ドキュメントは本プロジェクトにおけるログ出力方針を定義する。

目的

* 障害調査を可能にする
* 不要なログを防ぐ
* 個人情報をログへ出力しない
* Sentry連携を前提とする

---

# Basic Policy

## Direct Console Usage

UI層およびfeature層から直接consoleを呼ばない。

NG

```ts
console.error(error);
```

OK

```ts
logger.error("failed_to_save_weight_record", error);
```

---

## Logger Usage

ログ出力は必ず `lib/logger.ts` を経由する。

---

# Log Levels

## debug

開発時の詳細調査用。

用途

* デバッグ
* 一時的な調査

本番では出力しない。

例

```ts
logger.debug("weight_records_loaded");
```

---

## info

通常処理の記録。

用途

* 重要イベント
* 状態変化

例

```ts
logger.info("goal_setting_updated");
```

---

## warn

復旧可能な異常。

例

* localStorage破損
* 想定外入力
* フォールバック利用

例

```ts
logger.warn("failed_to_parse_storage");
```

---

## error

調査が必要な異常。

例

* Runtime Error
* 保存失敗
* API失敗
* 想定外例外

例

```ts
logger.error("failed_to_save_weight_record", error);
```

---

# Sensitive Information Policy

ログ出力禁止。

---

## Personal Information

禁止

* メールアドレス
* ユーザーID
* 氏名
* 個人情報

---

## Weight Data

禁止

* 体重値
* 目標体重
* BMI値

---

## Memo

禁止

* メモ全文
* ユーザー入力テキスト

---

## Authentication

禁止

* APIキー
* 認証トークン
* Cookie
* Session情報

---

# Allowed Context

出力可能。

例

```ts
{
  screen: "simulation",
  action: "calculate",
  result: "failed",
}
```

---

## Allowed Examples

```ts
logger.warn("failed_to_parse_storage", {
  storageKey: "weight-app:weight-records",
});
```

```ts
logger.error("simulation_calculation_failed", error, {
  screen: "simulation",
});
```

---

# Message Naming

snake_caseを利用する。

例

```text
weight_record_saved
goal_setting_updated
failed_to_parse_storage
simulation_calculation_failed
```

---

# Environment Policy

## Development

許可

* debug
* info
* warn
* error

---

## Staging

許可

* info
* warn
* error

debugは原則禁止。

---

## Production

許可

* warn
* error

debugは禁止。

infoは必要最小限。

---

# Sentry Integration

## Send Target

送信対象

* error
* 一部warn

---

## Do Not Send

送信禁止

* 個人情報
* メモ内容
* 体重値
* 認証情報

---

# Logger API

将来的に以下を実装する。

```ts
type LogContext = Record<
  string,
  string | number | boolean | null
>;

export const logger = {
  debug(message: string, context?: LogContext): void,
  info(message: string, context?: LogContext): void,
  warn(message: string, context?: LogContext): void,
  error(
    message: string,
    error?: unknown,
    context?: LogContext
  ): void,
};
```

---

# Test Requirement

logger実装時は以下をテストする。

* developmentで出力される
* productionでdebugが出力されない
* errorがSentry送信対象になる
* 個人情報が出力されない
* contextが正しく記録される

ロジック層は100%カバレッジ対象とする。

---

# Pull Request Checklist

ログ追加・変更時は以下を確認する。

* 個人情報を含まない
* メモ内容を含まない
* 体重値を含まない
* 認証情報を含まない
* snake_case命名である
* logger経由で出力している
* 不要なdebugログが残っていない
