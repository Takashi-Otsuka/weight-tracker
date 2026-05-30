# Development Rules

## Branch Strategy

### Main Branch

mainは常にリリース可能状態を維持する。

直接pushは禁止。

---

### Feature Branch

新機能開発

例:

```text
feature/weight-record-form
feature/simulation
feature/chart-page
```

---

### Fix Branch

不具合修正

例:

```text
fix/storage-parse-error
fix/chart-rendering
```

---

### Refactor Branch

リファクタリング

例:

```text
refactor/simulation-service
```

---

### Docs Branch

ドキュメント修正

例:

```text
docs/update-spec
```

---

### Chore Branch

設定変更や依存関係更新

例:

```text
chore/setup-eslint
chore/update-dependencies
```

---

## Commit Rules

Conventional Commitsを採用する。

形式:

```text
<type>: <summary>
```

例:

```text
feat: add simulation page
fix: handle invalid date input
docs: add architecture document
refactor: extract storage layer
chore: setup github actions
```

---

### Allowed Types

```text
feat
fix
docs
style
refactor
test
chore
build
ci
```

---

## Pull Request Rules

1 PR = 1目的

大規模変更は分割すること。

---

PR作成前に必ず実行する。

```bash
npm run lint
npm run build
```

---

以下を確認すること。

* 不要なconsole.logがない
* anyを使っていない
* eslintエラーがない
* buildエラーがない
* 未使用コードがない

---

## Code Review Rules

以下を確認する。

### Architecture

* UIとロジックが分離されているか
* storage層を利用しているか
* component責務が適切か

### Readability

* 命名が明確か
* 関数が肥大化していないか
* 重複コードがないか

### Future Compatibility

* Supabase移行しやすいか
* モバイル利用を阻害しないか

---

## Release Rules

mainへマージされたコードはリリース可能であること。

未完成機能はFeature Flagまたは別ブランチで管理すること。
