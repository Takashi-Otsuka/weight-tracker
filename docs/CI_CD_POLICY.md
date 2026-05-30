# CI/CD Policy

## Purpose

GitHub Actionsを利用して、Pull Requestおよびmainブランチの品質を自動検証する。

目的

* mainブランチの品質維持
* Codex生成コードの自動チェック
* 手動確認漏れの防止
* 将来的な自動デプロイの準備

---

# Branch Policy

## main

* 常にリリース可能状態を維持する
* 直接pushは禁止
* Pull Request経由でのみ更新する

## feature / fix / docs / chore / refactor

* 作業用ブランチ
* mainへのPull Request作成時にCIを実行する

---

# Required Checks

Pull Requestでは以下を必須とする。

```bash
npm run lint
npm run build
npm run test:coverage
```

---

# Optional Checks

Playwright導入後に追加する。

```bash
npm run test:e2e
```

---

# Quality Gate

mainへマージする条件

* lint成功
* build成功
* unit test成功
* logic coverage 100%
* 必要なcomponent test成功
* PRレビュー完了
* スクリーンショット添付済み

---

# Workflow Timing

## Pull Request

対象

```text
main
```

実行内容

* install
* lint
* build
* test
* coverage

---

## Push to main

実行内容

* install
* lint
* build
* test
* coverage
* production deploy

---

# Package Manager

MVPでは npm を利用する。

将来pnpmへ移行する場合は別途検討する。

---

# Node Version

LTS版を利用する。

`.nvmrc` または `package.json` の engines で固定する。

例

```text
22
```

---

# GitHub Actions Example

```yaml
name: CI

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Test with coverage
        run: npm run test:coverage
```

---

# E2E Workflow

Playwright導入後に追加する。

```yaml
name: E2E

on:
  workflow_dispatch:
  deployment_status:

jobs:
  e2e:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E
        run: npm run test:e2e
```

---

# Secrets Policy

GitHub Secretsで管理する。

対象例

* SENTRY_DSN
* SUPABASE_URL
* SUPABASE_ANON_KEY
* VERCEL_TOKEN

禁止

* ソースコードへ直接記載
* `.env.local` のコミット
* APIキーのPR貼り付け

---

# Future

将来的に以下を追加する。

* production deploy
* Playwright E2E
* Lighthouse
* dependency vulnerability check
* Sentry release tracking
