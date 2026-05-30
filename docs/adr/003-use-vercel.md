# ADR 003: Use Vercel

## Status

Accepted

## Context

Next.jsアプリを公開・検証するため、ホスティング環境が必要である。

要件は以下。

* Next.jsとの相性が良い
* staging / productionを分けられる
* GitHub連携が容易
* Preview Deploymentが使える
* 個人開発で運用しやすい
* 将来的に一般公開・収益化へ移行しやすい

候補として以下を検討した。

* Vercel
* Netlify
* Cloudflare Pages
* GitHub Pages
* 自前VPS

---

## Decision

Vercelを採用する。

環境は以下を想定する。

```text
feature/* → preview deployment
main → production
```

---

## Reasons

### 1. Next.jsとの相性

VercelはNext.jsとの統合が強い。

ビルド、ルーティング、環境変数、Preview Deploymentを扱いやすい。

---

### 2. GitHub連携

GitHubのブランチやPull Requestと連携しやすい。

PRごとにPreview URLを確認できる。

---

### 3. Preview運用

Pull RequestごとにVercel Preview Deploymentを利用することで、本番前確認がしやすい。

---

### 4. 個人開発向き

初期費用を抑えて運用できる。

インフラ管理負荷が低い。

---

### 5. 将来性

以下へ拡張しやすい。

* 独自ドメイン
* 環境変数管理
* Sentry連携
* AdSense導入
* Supabase連携

---

## Consequences

### Positive

* デプロイが容易
* Preview Deploymentが使える
* Next.js機能を活かしやすい
* staging / production分離がしやすい

---

### Negative

* Vercel依存が発生する
* 無料枠を超えると費用が発生する
* 一部機能はVercel仕様に依存する

---

## Alternatives Considered

### Netlify

選定しなかった理由

* Next.js対応はあるが、Next.js本家との親和性ではVercelが優位

---

### Cloudflare Pages

選定しなかった理由

* 高速で魅力的だが、Next.js機能の扱いで追加調整が必要になる可能性がある
* MVPではVercelの方が導入が容易

---

### GitHub Pages

選定しなかった理由

* 静的サイトには向いているが、Next.js運用の柔軟性が低い
* Preview Deploymentや環境変数運用が弱い

---

### 自前VPS

選定しなかった理由

* インフラ管理コストが高い
* MVPでは過剰

---

## Follow-up

将来的に以下を検討する。

* staging環境URLの確定
* production環境URLの確定
* 独自ドメイン
* Sentry連携
* Lighthouse計測
* デプロイ通知
