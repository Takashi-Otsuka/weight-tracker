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

Vercel Preview Deploymentをstaging相当の検証環境として扱う。

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

## Feature Branch

feature / fix / docs / chore / refactorブランチからPull Requestを作成すると、Vercel Preview Deploymentを生成する。

```text
feature/* → Pull Request → Vercel Preview Deployment
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
staging: Vercel Preview URL
production: https://weight-tracker.example.com
```

Preview URLはPull Requestごとに発行される。

---

# Environment Variables

## Local

```text
.env.local
```

## Staging

Vercel Preview Environment Variablesで管理する。

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

Playwright導入後、Pull RequestのVercel Preview Deploymentに対してE2Eテストを実行する。

対象

* 体重登録
* 体重編集
* 体重削除
* 目標設定
* グラフ表示
* シミュレーション

---

# Manual Verification

Pull RequestのVercel Preview Deploymentで以下を確認する。

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
Vercel Preview Deployment
  ↓
manual check
  ↓ merge
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

* 固定staging環境
* Sentry preview / staging environment
* Supabase staging project
* Feature Flag
* Lighthouse check
* AdSense検証環境
