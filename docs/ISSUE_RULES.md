# Issue Rules

## Issue Types

### Task

機能追加、改善、ドキュメント修正など。

例:

```text
[Task] 体重入力フォーム作成
[Task] シミュレーション機能実装
[Task] ROADMAP更新
```

### Bug

不具合修正。

例:

```text
[Bug] 同日データが重複登録される
[Bug] グラフ表示が崩れる
```

---

## Naming Rule

形式:

```text
[Task] タイトル
[Bug] タイトル
```

---

## Acceptance Criteria

着手前に完了条件を書く。

例:

```md
## Acceptance Criteria

- 今日の日付が初期表示される
- 体重を入力できる
- 保存できる
- 同日入力時は上書きされる
```

---

## Labels

使用するラベル

```text
task
bug
frontend
backend
logic
storage
documentation
blocked
```

---

## Rule

* 1 Issue = 1目的
* 1 PR = 1 Issueを原則とする
* Acceptance Criteria必須
* 完了時はDODを満たす
* 実装前に不明点を整理する
