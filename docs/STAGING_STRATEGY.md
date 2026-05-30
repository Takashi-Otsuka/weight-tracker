# Staging Strategy

## Purpose

本番公開前に、実際の利用に近い環境で動作確認を行う。

目的

* main反映前の品質確認
* E2Eテスト実行
* UI確認
* 将来のSupabase / Sentry / 広告導入前検証

---

# Environment

## Local

開発者PC上の環境。

用途

* 実装
* Unit Test
* Component Test
* 手動確認

---

## Staging

本番相当の検証環境。

用途

* 結合テスト
* E2Eテスト
* スマホ実機確認
* デプロイ確認

---

## Production

一般公開環境。

用途

* 実利用
* 将来の収益化

---

# Deployment Policy

## develop

developブランチへpushされたらstagingへデプロイする。

```text
develop → staging
```

---

## main

mainブランチへmergeされたらproductionへデプロイする。

```text
main → production
```

---

# Recommended Hosting

MVPではVercelを想定する。

理由

* Next.jsとの相性が良い
* Preview Deploymentが使いやすい
* 個人開発で扱いやすい
* 将来的なproduction運用に移行しやすい

---

# URL Policy

例

```text
local: http://localhost:3000
staging: https://weight-tracker-staging.example.com
production: https://weight-tracker.example.com
```

実URLは確定後に更新する。

---

# Environment Variables

## Local

```text
.env.local
```

## Staging

Vercel Environment Variablesで管理する。

## Production

Vercel Environment Variablesで管理する。

---

# Data Policy

## MVP

localStorage利用のため、stagingとproductionでDB分離は不要。

---

## Supabase導入後

以下を分離する。

```text
Supabase Staging Project
Supabase Production Project
```

stagingとproductionで同じDBを使わない。

---

# E2E Test

ステージング環境でPlaywrightを実行する。

対象

* 体重登録
* 体重編集
* 体重削除
* 目標設定
* グラフ表示
* シミュレーション

---

# Manual Verification

stagingで以下を確認する。

* iPhone Safari
* Chrome
* レスポンシブ表示
* PWAホーム画面追加
* localStorage保持
* エラー表示

---

# Release Flow

## Phase 1

```text
feature/*
  ↓ PR
develop
  ↓ staging deploy
manual check
  ↓ PR
main
  ↓ production deploy
```

---

# Rollback Policy

## MVP

問題が発生した場合

* mainの直前コミットへrevert
* Vercelの過去Deploymentへrollback

---

# Staging Completion Criteria

staging確認完了条件

* E2E成功
* 手動確認完了
* iPhone表示確認完了
* 重大バグなし

---

# Future

将来的に追加する。

* Sentry staging environment
* Supabase staging project
* Feature Flag
* Lighthouse check
* AdSense検証環境
