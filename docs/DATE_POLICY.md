# Date Policy

## Purpose

本プロジェクトの日付・時刻処理方針を定義する。

体重管理は日単位で行うため、一貫性を重視する。

---

# Time Zone

固定

```text
Asia/Tokyo
```

---

## Future

海外対応を行うまでは変更しない。

---

# Storage Format

保存形式

```text
YYYY-MM-DD
```

例

```text
2026-05-30
```

---

# Database Format

将来Supabase移行時

```sql
DATE
```

を利用する。

---

# Display Format

ユーザー表示

```text
YYYY/MM/DD
```

例

```text
2026/05/30
```

---

# Current Date

アプリ内で直接利用しない。

NG

```ts
new Date()
```

を各所で呼ぶ。

---

OK

```ts
getToday()
```

共通関数経由で取得する。

---

# Utility Functions

共通関数を利用する。

例

```ts
getToday()
formatDate()
parseDate()
isSameDate()
```

---

# Record Unit

記録単位

```text
1日
```

---

## Rule

同日データは1件のみ。

保存時

```text
上書き
```

とする。

---

# Comparison

比較対象は日付のみ。

時刻は利用しない。

OK

```text
2026-05-30
```

NG

```text
2026-05-30T12:34:56
```

---

# Test Requirement

日付処理は固定日時でテストする。

例

```text
2026-05-30
```

---

## Mock Date

Vitestで固定する。

目的

* テストの再現性確保

---

# Future Expansion

将来以下に対応可能な設計とする。

* ユーザータイムゾーン
* 多言語日付表示
* 海外展開

ただしMVPでは対応しない。
