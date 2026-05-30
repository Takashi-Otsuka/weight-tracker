# ADR 001: Use Next.js

## Status

Accepted

## Context

体重管理アプリを開発するにあたり、以下の要件がある。

* iPhoneで簡単に利用できる
* Webアプリとして素早く開発できる
* 将来的にPWA対応したい
* 将来的に一般公開・収益化したい
* TypeScriptで安全に開発したい
* Codexによる実装支援と相性が良い構成にしたい

候補として以下を検討した。

* Next.js
* React SPA
* Expo / React Native
* Flutter
* ネイティブiOSアプリ

---

## Decision

Next.jsを採用する。

MVPでは以下の構成とする。

* Next.js App Router
* TypeScript
* Tailwind CSS
* Recharts
* PWA対応を前提とした構成

---

## Reasons

### 1. 開発速度

Next.jsはReactベースであり、画面開発・ルーティング・ビルド環境が整っている。

MVPを素早く作成しやすい。

---

### 2. iPhone対応

WebアプリとしてiPhone Safariで利用できる。

PWA化により、ホーム画面追加も可能。

---

### 3. 将来性

以下へ拡張しやすい。

* Supabase認証
* PostgreSQL保存
* Vercelデプロイ
* AdSense導入
* PWA対応
* API Route追加

---

### 4. TypeScriptとの相性

TypeScriptを標準的に利用できる。

型定義、テスト、Codex利用時の品質維持に向いている。

---

### 5. Codexとの相性

Next.jsは一般的な構成であり、Codexが理解しやすい。

以下を明文化することで、AIによる実装品質を維持しやすい。

* SPEC.md
* ARCHITECTURE.md
* DOD.md
* TEST_STRATEGY.md
* .codex/instructions.md

---

## Consequences

### Positive

* MVPを短期間で構築しやすい
* Web公開が容易
* PWA対応が可能
* 将来のクラウド同期・収益化に対応しやすい
* TypeScriptで保守性を確保できる

---

### Negative

* 完全なネイティブアプリ体験ではない
* Apple Health連携はWebアプリ単体では難しい
* iOS通知やバックグラウンド機能に制約がある

---

## Alternatives Considered

### React SPA

選定しなかった理由

* ルーティングやビルド構成を別途整える必要がある
* 将来の公開・拡張性ではNext.jsの方が有利

---

### Expo / React Native

選定しなかった理由

* iOS/Androidアプリとしては有力だが、MVPの初速ではNext.jsの方が軽い
* App Store公開前提になると運用負荷が増える

将来的にネイティブアプリ化する場合は再検討する。

---

### Flutter

選定しなかった理由

* 学習・実装コストが増える
* Web公開やNext.js系のエコシステム活用と比べてMVP向きではない

---

### Native iOS

選定しなかった理由

* iPhone向け体験は最も良いが、初期開発コストが高い
* AndroidやWeb展開がしにくい

---

## Follow-up

将来的に以下を検討する。

* PWA正式対応
* Expo / React Native化
* Apple Health連携
* モバイルアプリ化
